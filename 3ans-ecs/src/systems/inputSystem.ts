// systems/inputSystem.ts
import { System } from "@3ans-ecs/core/systems/system";

export class InputSystem extends System {
  private static _instance: InputSystem;

  private constructor() {
    super();
  }

  protected onInit(): void {}

  protected onUpdate(delta: number): void {}

  public getSignature(): number {
    return this.requiredSignature;
  }

  public onCleanup(): void {}

  public static getInstance(): InputSystem {
    if (!this._instance) {
      this._instance = new InputSystem();
    }
    return this._instance;
  }
}
