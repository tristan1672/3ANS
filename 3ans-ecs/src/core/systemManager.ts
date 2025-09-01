import { System } from "./system";

export class SystemManager {
  private static _instance: SystemManager;

  private systems: System[] = [];

  private constructor() {}

  registerSystem(system: System): void {
    if (!this.systems.includes(system)) {
      this.systems.push(system);
    }
  }

  // Remove a system instance
  removeSystem(system: System): void {
    this.systems = this.systems.filter((s) => s !== system);
  }

  // Call init() on all systems
  init(): void {
    for (const system of this.systems) {
      system.init();
    }
  }

  // Call update() on all systems, delta time passed
  update(delta: number): void {
    for (const system of this.systems) {
      system.update(delta);
    }
  }

  // Call cleanup() on all systems
  cleanup(): void {
    for (const system of this.systems) {
      system.cleanup();
    }
  }

  // Optional: get systems of a specific type
  getSystems<T extends System>(ctor: new (...args: any[]) => T): T[] {
    return this.systems.filter((s) => s instanceof ctor) as T[];
  }

  //Singleton accessor
  public static getInstance(): SystemManager {
    if (!this._instance) this._instance = new SystemManager();
    return this._instance;
  }
}
