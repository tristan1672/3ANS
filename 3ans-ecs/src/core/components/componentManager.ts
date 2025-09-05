// ComponentManager.ts
import { ComponentStore } from "./componentStore";
import { Manager } from "../manager";
import {
  ComponentAddedEvent,
  ComponentRemovedEvent,
} from "@3ans-ecs/events/componentEvent";

export type ComponentConstructor<T> = new (...args: any[]) => T;

export class ComponentManager extends Manager {
  private static _instance: ComponentManager;

  // Registry
  public componentBits = new Map<string, number>();
  public componentConstructors = new Map<string, ComponentConstructor<any>>();
  private stringToType = new Map<string, ComponentConstructor<any>>();
  private typeToString = new Map<ComponentConstructor<any>, string>();

  // Component Arrays
  private componentStores = new Map<string, ComponentStore<any>>();

  private nextBit = 0;

  private constructor() {
    super();
  }

  // Register a component type
  registerComponent<T>(ctor: ComponentConstructor<T>): void {
    const name = ctor.name;
    if (this.componentBits.has(name)) return; // already registered

    const bit = 1 << this.nextBit;
    this.nextBit++;

    this.componentBits.set(name, bit);
    this.componentConstructors.set(name, ctor);
    this.stringToType.set(name, ctor);
    this.typeToString.set(ctor, name);

    // Initialize store for this component type
    this.componentStores.set(name, new ComponentStore<T>());
    console.log(`${name} registered.`);
  }

  // Add a component instance to an entity
  appendComponent<T>(entityId: number, component: T): void {
    const name = (component as any).constructor.name;
    const bit = this.getBit(name);
    const store = this.componentStores.get(name);
    if (!store) throw new Error(`Component ${name} not registered`);
    store.add(entityId, component);

    //fire component change event
    this.master.engineEvents.emit(new ComponentAddedEvent(entityId, bit));
  }

  // Create a component instance and attach to entity
  createComponent<T>(entityId: number, ctor: ComponentConstructor<T>): T {
    const name = ctor.name;
    const store = this.componentStores.get(name) as ComponentStore<T>;
    if (!store) throw new Error(`Component not registered: ${name}`);
    const instance = new ctor();
    store.add(entityId, instance);
    return instance;

    //fire component change event
  }

  // Remove a component from an entity
  removeComponent<T>(entityId: number, ctor: ComponentConstructor<T>): void {
    const bit = this.getBit(ctor);
    const store = this.componentStores.get(ctor.name) as ComponentStore<T>;
    store?.remove(entityId);

    if (store) {
      this.master.engineEvents.emit(new ComponentRemovedEvent(entityId, bit));
    }
  }

  // Get entity component of a type
  getComponent<T>(
    entityId: number,
    ctor: ComponentConstructor<T>
  ): T | undefined {
    const store = this.componentStores.get(ctor.name) as ComponentStore<T>;
    return store?.get(entityId);
  }

  // Get componentStore of a type (array)
  getComponentStore<T>(
    componentClass: ComponentConstructor<T>
  ): ComponentStore<T> | undefined {
    const store = this.componentStores.get(componentClass.name);
    return store as ComponentStore<T> | undefined;
  }

  // Access all entries for a component type
  getAllComponents<T>(
    componentClass: ComponentConstructor<T>
  ): IterableIterator<[number, T]> | undefined {
    const store = this.componentStores.get(componentClass.name);
    return store?.entries();
  }

  getRegisteredComponents(): ComponentConstructor<any>[] {
    return Array.from(this.componentConstructors.values());
  }

  // Bitmask lookup
  getBit<T>(ctor: ComponentConstructor<T> | string): number {
    if (typeof ctor === "string") {
      return this.componentBits.get(ctor) ?? 0;
    } else {
      return this.componentBits.get(ctor.name) ?? 0;
    }
  }

  // Type to string
  getTypeFromString<T>(name: string): ComponentConstructor<T> | undefined {
    return this.stringToType.get(name);
  }

  // String to Type
  getStringFromType<T>(
    componentClass: ComponentConstructor<T>
  ): string | undefined {
    return this.typeToString.get(componentClass);
  }

  // Component Boolean
  hasComponent<T>(entityId: number, ctor: ComponentConstructor<T>): boolean {
    const store = this.componentStores.get(ctor.name) as
      | ComponentStore<T>
      | undefined;
    return !!store && store.has(entityId);
  }

  // Singleton accessor
  public static getInstance(): ComponentManager {
    if (!this._instance) {
      this._instance = new ComponentManager();
    }
    return this._instance;
  }
}
