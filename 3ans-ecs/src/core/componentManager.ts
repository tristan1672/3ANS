// ComponentManager.ts
import { ComponentStore } from "./componentStore";

type ComponentConstructor<T> = new (...args: any[]) => T;

export class ComponentManager {
  private static _instance: ComponentManager;

  // Registry
  private componentBits = new Map<string, number>();
  private componentConstructors = new Map<string, ComponentConstructor<any>>();
  private stringToType = new Map<string, ComponentConstructor<any>>();
  private typeToString = new Map<ComponentConstructor<any>, string>();

  // Storage: per component type, map of entity -> component instance
  private componentStores = new Map<string, ComponentStore<any>>();

  private nextBit = 0;

  private constructor() {}

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
  addComponent<T>(entityId: number, component: T): void {
    const name = (component as any).constructor.name;
    const store = this.componentStores.get(name);
    if (!store) throw new Error(`Component ${name} not registered`);
    store.add(entityId, component);
  }

  // Create a component instance and attach to entity
  createComponent<T>(entityId: number, ctor: ComponentConstructor<T>): T {
    const name = ctor.name;
    const store = this.componentStores.get(name) as ComponentStore<T>;
    if (!store) throw new Error(`Component not registered: ${name}`);
    const instance = new ctor(); // can add args later
    store.add(entityId, instance);
    return instance;
  }

  // Remove a component from an entity
  removeComponent<T>(entityId: number, ctor: ComponentConstructor<T>): void {
    const store = this.componentStores.get(ctor.name) as ComponentStore<T>;
    store?.remove(entityId);
  }

  // Get all components of a type
  getComponent<T>(
    entityId: number,
    ctor: ComponentConstructor<T>
  ): T | undefined {
    const store = this.componentStores.get(ctor.name) as ComponentStore<T>;
    return store?.get(entityId);
  }

  getComponentStore<T>( componentClass: ComponentConstructor<T>): ComponentStore<T> {

  }
   
  // Access all entries for a component type
  getAllComponents<T>(
    componentClass: ComponentConstructor<T>
  ): IterableIterator<[number, T]> | undefined {
    const store = this.componentStores.get(componentClass.name);
    return store?.entries();
  }

  // Bitmask lookup
  getBit(name: string): number {
    return this.componentBits.get(name) ?? 0;
  }

  // Type ↔ string mapping
  getTypeFromString<T>(name: string): ComponentConstructor<T> | undefined {
    return this.stringToType.get(name);
  }

  getStringFromType<T>(
    componentClass: ComponentConstructor<T>
  ): string | undefined {
    return this.typeToString.get(componentClass);
  }

  // Singleton accessor
  public static getInstance(): ComponentManager {
    if (!this._instance) {
      this._instance = new ComponentManager();
    }
    return this._instance;
  }
}
