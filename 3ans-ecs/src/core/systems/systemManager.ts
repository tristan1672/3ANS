import { Manager } from "../manager";
import { System, SingletonSystemClass } from "./system";
import { ComponentConstructor } from "../components/componentManager";

export class SystemManager extends Manager {
  private static _instance: SystemManager;

  private systems: System[] = [];

  private constructor() {
    super();
  }

  registerSystem<T extends System>(SystemClass: SingletonSystemClass<T>): void {
    const system = SystemClass.getInstance();

    if (this.systems.includes(system)) return;

    if ("requiredComponents" in SystemClass) {
      const components = (SystemClass as any)
        .requiredComponents as ComponentConstructor<any>[];

      const signature = components.reduce(
        (sig, ctor: ComponentConstructor<any>) =>
          sig | this.master.getBit(ctor),
        0
      );

      system.requiredSignature = signature;
    }

    this.systems.push(system);
    console.log(`${(SystemClass as any).name} initialized`);
    this.master.registerSystemSignature(system, system.requiredSignature);
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

  // Call cleanup() on all systemsa
  cleanup(): void {
    for (const system of this.systems) {
      system.cleanup();
    }
  }

  // Optional: get systems of a specific type
  getSystems(): System[] {
    return this.systems;
  }

  getSystem<T extends System>(
    SystemClass: SingletonSystemClass<T>
  ): T | undefined {
    const instance = SystemClass.getInstance();
    return this.systems.includes(instance) ? instance : undefined;
  }

  public static getInstance(): SystemManager {
    if (!this._instance) this._instance = new SystemManager();
    return this._instance;
  }
}
