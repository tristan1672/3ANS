import { Entity, EntityData } from "./entity";
import { Manager } from "../manager";

export class EntityManager extends Manager {
  private static _instance: EntityManager;
  private nextEntity: Entity = 0;
  private entities: Map<Entity, EntityData> = new Map();

  createEntity(): EntityData {
    const entity = new EntityData(this.nextEntity++);
    this.entities.set(entity.id, entity);
    return entity;
  }

  deleteEntity(entity: EntityData | Entity): void {
    const id = this.resolveEntityId(entity);
    this.entities.delete(id);
  }

  setEntitySignature(entity: EntityData | Entity, signature: number): void {
    const data = this.getEntityData(entity);
    if (data) data.signature = signature;
  }

  getEntitySignature(entity: EntityData | Entity): number | undefined {
    return this.getEntityData(entity)?.signature;
  }

  getEntityData(entity: EntityData | Entity): EntityData | undefined {
    const id = this.resolveEntityId(entity);
    return this.entities.get(id);
  }
  //alias
  getEntity(id: Entity | EntityData): EntityData | undefined {
    return this.getEntityData(id);
  }

  getEntities(): EntityData[] {
    return Array.from(this.entities.values());
  }

  hasEntity(entity: EntityData | Entity): boolean {
    const id = this.resolveEntityId(entity);
    return this.entities.has(id);
  }

  // --- Helpers ---
  private resolveEntityId(entity: EntityData | Entity): Entity {
    return typeof entity === "number" ? entity : entity.id;
  }

  // --- Singleton accessor ---
  public static getInstance(): EntityManager {
    if (!this._instance) this._instance = new EntityManager();
    return this._instance;
  }
}
