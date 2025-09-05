// managers/SignatureManager.ts
import { Entity } from "../entities/entity";
import { Manager } from "../manager";
import { System } from "../systems/system";
import { ComponentAddedEvent, ComponentRemovedEvent } from "@3ans-ecs/events/componentEvent";
import { ComponentManager } from "../components/componentManager";

export class SignatureManager extends Manager {
  private static _instance: SignatureManager;
  private entitySignatures = new Map<Entity, number>();
  private systemSignatures = new Map<System, number>();
  private systemEntities = new Map<System, Set<Entity>>();

  // --- Manager Functions --- //

  // Register a new entity (e.g. from EntityManager)
  registerEntitySignature(entity: Entity, initialSignature: number = 0): void {
    this.entitySignatures.set(entity, initialSignature);
  }

  // Register a system with its required signature
  registerSystemSignature(system: System, requiredSignature: number): void {
    this.systemSignatures.set(system, requiredSignature);
    this.systemEntities.set(system, new Set<Entity>());

    // Scan all current entities and add matches
    for (const [entity, sig] of this.entitySignatures) {
      if ((sig & requiredSignature) === requiredSignature) {
        this.systemEntities.get(system)!.add(entity);
      }
    }
  }

  // Unregister system (cleanup)
  unregisterSystem(system: System): void {
    this.systemSignatures.delete(system);
    this.systemEntities.delete(system);
  }

  // Update when component is added or removed
  updateEntitySignature(
    entity: Entity,
    componentBit: number,
    added: boolean
  ): void {
    const oldSig = this.entitySignatures.get(entity) || 0;
    const newSig = added ? oldSig | componentBit : oldSig & ~componentBit;
    this.entitySignatures.set(entity, newSig);

    // Notify all systems
    for (const [system, requiredSig] of this.systemSignatures) {
      const wasMatch = (oldSig & requiredSig) === requiredSig;
      const isMatch = (newSig & requiredSig) === requiredSig;

      const entities = this.systemEntities.get(system)!;

      if (!wasMatch && isMatch) {
        entities.add(entity);
      } else if (wasMatch && !isMatch) {
        entities.delete(entity);
      }
    }
  }

  // Get all entities currently matching a signature
  getEntitiesMatching(signature: number): Entity[] {
    return Array.from(this.entitySignatures.entries())
      .filter(([_, sig]) => (sig & signature) === signature)
      .map(([entity, _]) => entity);
  }

  // Get entities for a specific system
  getSystemEntities(system: System): Entity[] {
    return Array.from(this.systemEntities.get(system) || []);
  }

  // Get current signature of an entity
  getEntitySignature(entity: Entity): number {
    return this.master.getEntitySignature(entity) ?? 0;
  }

  // --- Event Handlers --- //
  private onComponentAdded(entityId: Entity, componentBit: number): void {
    const entity = this.master.getEntityData(entityId);
    if (!entity) return;

    const oldSig = entity.signature;
    const newSig = oldSig | componentBit;
    entity.signature = newSig;

    // Notify all systems
    for (const [system, requiredSig] of this.systemSignatures) {
      const wasMatching = this.signatureMatches(oldSig, requiredSig);
      const isMatching = this.signatureMatches(newSig, requiredSig);

      const entitySet = this.systemEntities.get(system)!;

      if (!wasMatching && isMatching) {
        entitySet.add(entityId);
      }
    }
  }

  private onComponentRemoved(entityId: Entity, componentBit: number): void {
    const entity = this.master.getEntityData(entityId);
    if (!entity) return;

    const oldSig = entity.signature;
    const newSig = oldSig & ~componentBit;
    entity.signature = newSig;

    for (const [system, requiredSig] of this.systemSignatures) {
      const wasMatching = this.signatureMatches(oldSig, requiredSig);
      const isMatching = this.signatureMatches(newSig, requiredSig);
      const entitySet = this.systemEntities.get(system)!;

      if (wasMatching && !isMatching) {
        entitySet.delete(entityId);
      }
    }
  }

  private signatureMatches(signature: number, required: number): boolean {
    return (signature & required) === required;
  }

  /**
   * Debug: Print all entity and system signatures in a readable format
   * Optionally pass a ComponentManager to decode bits into component names
   */
  printSignatures(componentManager?: ComponentManager): void {
  if (!componentManager) {
    console.warn("SignatureManager.printSignatures: No ComponentManager provided — skipping component names");
    return;
  }

  console.group(" SignatureManager: Current State");

  // --- 1. Print Component Bits
  console.group(" Component Bits");
  const allComponents = componentManager.getRegisteredComponents();
  for (const ctor of allComponents) {
    const bit = componentManager.getBit(ctor);
    const bitStr = `0b${bit.toString(2).padStart(8, '0')}`;
    console.log(`  ${ctor.name} → ${bitStr} (${bit})`);
  }
  console.groupEnd();

  // --- 2. Print Entity Signatures
  console.group(` ${this.entitySignatures.size} Entities`);
  for (const [entityId, signature] of this.entitySignatures) {
    const componentNames: string[] = [];
    for (const ctor of allComponents) {
      const bit = componentManager.getBit(ctor);
      if (signature & bit) {
        componentNames.push(ctor.name);
      }
    }
    const sigStr = `0b${signature.toString(2).padStart(8, '0')} (${signature})`;
    console.log(`Entity(${entityId}) → ${sigStr} [${componentNames.join(", ") || "none"}]`);
  }
  console.groupEnd();

  // --- 3. Print System Signatures and Entities
  console.group(`  ${this.systemSignatures.size} Systems`);
  for (const [system, requiredSig] of this.systemSignatures) {
    const sysName = system.constructor.name;

    // Decode required components
    const requiredComponents: string[] = [];
    for (const ctor of allComponents) {
      const bit = componentManager.getBit(ctor);
      if (requiredSig & bit) {
        requiredComponents.push(ctor.name);
      }
    }
    const sigStr = `0b${requiredSig.toString(2).padStart(8, '0')} (${requiredSig})`;

    const entities = this.systemEntities.get(system);
    const entityList = entities && entities.size > 0 ? Array.from(entities).join(", ") : "none";

    console.group(`${sysName} → ${sigStr} [${requiredComponents.join(", ")}]`);
    console.log(` Entities: ${entityList}`);
    console.groupEnd();
  }
  console.groupEnd();

  console.groupEnd(); // Main group
}

  /**
   * Helper: Extract all bit positions set in a signature
   * e.g., 0b101 → [1, 4]
   */
  private getBitPositions(signature: number): number[] {
    const bits: number[] = [];
    let bit = 1;
    for (let i = 0; i < 32; i++) {
      if (signature & bit) bits.push(bit);
      bit <<= 1;
    }
    return bits;
  }

  init(): void {
    this.master.engineEvents.on(ComponentAddedEvent, (e) => {
      this.onComponentAdded(e.entityId, e.componentBit);
    });

    this.master.engineEvents.on(ComponentRemovedEvent, (e) => {
      this.onComponentRemoved(e.entityId, e.componentBit);
    });
  }

  cleanup(): void {
    this.systemEntities.clear();
    this.entitySignatures.clear();
    this.systemSignatures.clear();
  }

  public static getInstance(): SignatureManager {
    if (!this._instance) this._instance = new SignatureManager();
    return this._instance;
  }
}
