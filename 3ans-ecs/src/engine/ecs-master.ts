// --- ecs-imports --- //
import { EntityManager } from "@3ans-ecs/core/entities/entityManager";
import {
  ComponentManager,
  ComponentConstructor,
} from "@3ans-ecs/core/components/componentManager";
import { ComponentStore } from "@3ans-ecs/core/components/componentStore";
import { SystemManager } from "@3ans-ecs/core/systems/systemManager";
import { System, SingletonSystemClass } from "@3ans-ecs/core/systems/system";
import { Entity, EntityData } from "@3ans-ecs/core/entities/entity";

// --- Systems --- //
import { RenderSystem } from "@3ans-ecs/systems/renderSystem";
import { RaycastSystem } from "@3ans-ecs/systems/raycastSystem";
import { ExampleSystem } from "@3ans-ecs/systems/exampleSystem";

// --- Components --- //
import { TransformComponent } from "@3ans-ecs/components/transformComponent";
import { MeshComponent } from "@3ans-ecs/components/meshComponent";

// Engine Level Objects ---//
import { EventManager } from "@3ans-ecs/events/base/eventManager";
import { SignatureManager } from "@3ans-ecs/core/signature/signatureManager";
import { HoverComponent } from "@3ans-ecs/components/hoverComponent";

export class Master {
  private static _instance: Master;

  // Instances
  public readonly engineEvents = new EventManager();
  public readonly renderEvents = new EventManager();

  private constructor() {
    EntityManager.getInstance();
    ComponentManager.getInstance();
    SystemManager.getInstance();
    SignatureManager.getInstance();
  }

  // Driver
  init() {
    // Register Components
    this.registerComponent(TransformComponent);
    this.registerComponent(MeshComponent);
    this.registerComponent(HoverComponent);

    // Register Systems
    this.registerSystem(ExampleSystem); //calls signature manager to register
    this.registerSystem(RenderSystem);
    this.registerSystem(RaycastSystem);

    // Initialize Systems & Signatures
    SignatureManager.getInstance().init;
    SystemManager.getInstance().init;

    const entity = this.createEntity()
    this.createComponent(entity.id, TransformComponent)

    SignatureManager.getInstance().printSignatures(ComponentManager.getInstance())
  }

  update(delta: number) {
    SystemManager.getInstance().update(delta);
  }

  cleanup() {
    this.engineEvents.cleanup();
    this.renderEvents.cleanup();
    SignatureManager.getInstance().cleanup();
    SystemManager.getInstance().cleanup();
  }

  // --- Master Functions --- //

  // Entities
  createEntity(): EntityData {
    return EntityManager.getInstance().createEntity();
  }

  deleteEntity(entity: EntityData) {
    EntityManager.getInstance().deleteEntity(entity);
  }

  setEntitySignature(entity: EntityData, signature: number) {
    EntityManager.getInstance().setEntitySignature(entity, signature);
  }

  getEntitySignature(entity: EntityData | Entity): number | undefined {
    return EntityManager.getInstance().getEntitySignature(entity);
  }

  getEntityData(entity: EntityData | Entity): EntityData | undefined {
    return EntityManager.getInstance().getEntityData(entity);
  }

  hasEntity(entity: EntityData | Entity): boolean {
    return EntityManager.getInstance().hasEntity(entity);
  }

  getEntities(): EntityData[] {
    return EntityManager.getInstance().getEntities();
  }

  // Components
  registerComponent<T>(ctor: ComponentConstructor<T>): void {
    ComponentManager.getInstance().registerComponent(ctor);
  }

  appendComponent<T>(entityId: number, component: T): void {
    ComponentManager.getInstance().appendComponent(entityId, component);
  }

  createComponent<T>(entityId: number, ctor: ComponentConstructor<T>): T {
    return ComponentManager.getInstance().createComponent(entityId, ctor);
  }

  removeComponent<T>(entityId: number, ctor: ComponentConstructor<T>): void {
    ComponentManager.getInstance().removeComponent(entityId, ctor);
  }

  getComponent<T>(
    entityId: number,
    ctor: ComponentConstructor<T>
  ): T | undefined {
    return ComponentManager.getInstance().getComponent(entityId, ctor);
  }

  getComponentStore<T>(
    ctor: ComponentConstructor<T>
  ): ComponentStore<T> | undefined {
    return ComponentManager.getInstance().getComponentStore(ctor);
  }

  getAllComponents<T>(
    ctor: ComponentConstructor<T>
  ): IterableIterator<[number, T]> | undefined {
    return ComponentManager.getInstance().getAllComponents(ctor);
  }

  getBit<T>(ctor: ComponentConstructor<T> | string): number {
    return ComponentManager.getInstance().getBit(ctor);
  }

  getTypeFromString<T>(name: string): ComponentConstructor<T> | undefined {
    return ComponentManager.getInstance().getTypeFromString(name);
  }

  getStringFromType<T>(
    componentClass: ComponentConstructor<T>
  ): string | undefined {
    return ComponentManager.getInstance().getStringFromType<T>(componentClass);
  }

  hasComponent<T>(entityId: number, ctor: ComponentConstructor<T>): boolean {
    return ComponentManager.getInstance().hasComponent(entityId, ctor);
  }

  // Systems
  registerSystem<T extends System>(SystemClass: SingletonSystemClass<T>): void {
    SystemManager.getInstance().registerSystem(SystemClass);
  }

  removeSystem(system: System): void {
    SystemManager.getInstance().removeSystem(system);
  }

  getSystems(): System[] {
    return SystemManager.getInstance().getSystems();
  }

  getSystem<T extends System>(
    SystemClass: SingletonSystemClass<T>
  ): T | undefined {
    return SystemManager.getInstance().getSystem(SystemClass);
  }

  // Signatures
  registerEntity(entity: Entity, initialSignature: number = 0): void {
    SignatureManager.getInstance().registerEntitySignature(
      entity,
      initialSignature
    );
  }

  registerSystemSignature(system: System, requiredSignature: number): void {
    SignatureManager.getInstance().registerSystemSignature(
      system,
      requiredSignature
    );
  }

  unregisterSystem(system: System): void {
    SignatureManager.getInstance().unregisterSystem(system);
  }

  updateEntitySignature(
    entity: Entity,
    componentBit: number,
    added: boolean
  ): void {}

  getEntitiesMatching(signature: number): Entity[] {
    return SignatureManager.getInstance().getEntitiesMatching(signature);
  }

  getSystemEntities(system: System): Entity[] {
    return SignatureManager.getInstance().getSystemEntities(system);
  }

  public static getInstance(): Master {
    if (!this._instance) this._instance = new Master();
    return this._instance;
  }
}
