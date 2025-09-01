import { Entity, EntityData } from "./entity";

// EntityManager.ts
export class EntityManager {
  public static _instance: EntityManager;
  private nextEntity: Entity = 0;
  private entities: EntityData[] = [];

  createEntity(): EntityData {
    const entity = new EntityData(this.nextEntity++);
    this.entities.push(entity);
    return entity;
  }

  deleteEntity(entity: EntityData) {
    this.entities = this.entities.filter((e) => e.id !== entity.id);
  }

  setEntitySignature(entity: EntityData, signature: number) {
    entity.signature = signature;
  }

  getEntities(): EntityData[] {
    return this.entities;
  }

  //Singleton accessor
  public static getInstance(): EntityManager {
    if (!this._instance) this._instance = new EntityManager();
    return this._instance;
  }
}
