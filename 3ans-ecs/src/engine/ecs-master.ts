import { EntityManager } from "@3ans-ecs/core/entityManager";
import { ComponentManager } from "@3ans-ecs/core/componentManager";
import { SystemManager } from "@3ans-ecs/core/systemManager";
import { System } from "@3ans-ecs/core/system";
import { EntityData } from "@3ans-ecs/core/entity";

export class Master {
  private static _instance: Master;
  private constructor() {
    EntityManager.getInstance();
    ComponentManager.getInstance();
    SystemManager.getInstance();
  }

  //Entities
  createEntity(): EntityData {
    return EntityManager.getInstance().createEntity();
  }

  deleteEntity(entity: EntityData) {
    EntityManager.getInstance().deleteEntity(entity);
  }

  setEntitySignature(entity: EntityData, signature: number) {
    EntityManager.getInstance().setEntitySignature(entity, signature);
  }

  getEntities(): EntityData[] {
    return EntityManager.getInstance().getEntities();
  }

  //Components
  

  //Systems
  registerSystem(system: System): void {
    SystemManager.getInstance().registerSystem(system);
  }

  removeSystem(system: System): void {
    SystemManager.getInstance().removeSystem(system);
  }

  public static getInstance(): Master {
    if (!this._instance) this._instance = new Master();
    return this._instance;
  }
}
