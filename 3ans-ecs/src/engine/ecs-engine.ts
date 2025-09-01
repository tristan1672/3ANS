//engine.ts ecs driver
import { ComponentManager } from "@3ans-ecs/core/componentManager";
import { SystemManager } from "@3ans-ecs/core/systemManager";
import { EntityManager } from "@3ans-ecs/core/entityManager";

export class Engine {
  private static _instance: Engine;

  private constructor() {
    ComponentManager.getInstance();
    SystemManager.getInstance();
    EntityManager.getInstance();
  }

  init(): void {
    // Register Components
  }

  update(): void {}

  cleanup(): void {}

  //Singleton accessor
  public static getInstance(): Engine {
    if (!this._instance) this._instance = new Engine();
    return this._instance;
  }
}
