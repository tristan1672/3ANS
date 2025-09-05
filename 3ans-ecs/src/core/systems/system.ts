// system.ts
import { Entity } from "../entities/entity";
import { Master } from "@3ans-ecs/engine/ecs-master";
import { ComponentConstructor } from "../components/componentManager";

export type SingletonSystemClass<T extends System> = {
  getInstance(): T;
};

export abstract class System {
  static readonly requiredComponents?: ComponentConstructor<any>[];
  requiredSignature: number = 0;

  // System Template methods
  init(): void {
    console.log(`${this.constructor.name} initialized`);
    this.onInit();
  }

  update(delta: number): void {
    //console.log(`${this.constructor.name} updated with delta=${delta}`);
    this.onUpdate(delta);
  }

  cleanup(): void {
    console.log(`${this.constructor.name} cleaned up`);
    this.onCleanup();
  }

  // Hooks for Derived Classes
  protected abstract onInit(): void;
  protected abstract onUpdate(delta: number): void;
  protected abstract onCleanup(): void;
  get entities(): Entity[] {
    return Master.getInstance().getSystemEntities(this);
  }

  // Engine Level Access
  protected get engineEvents() {
    return Master.getInstance().engineEvents;
  }

  protected get renderEvents() {
    return Master.getInstance().renderEvents;
  }

  protected get master() {
    return Master.getInstance();
  }
}
