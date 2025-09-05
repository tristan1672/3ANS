// systems/exampleSystem
import { MeshComponent } from "@3ans-ecs/components/meshComponent";
import { TransformComponent } from "@3ans-ecs/components/transformComponent";
import { System } from "@3ans-ecs/core/systems/system";

export class ExampleSystem extends System {
  static readonly requiredComponents = [TransformComponent]
  private static _instance: ExampleSystem;

  private constructor() {
    super();
  }

  protected onInit(): void {}

  protected onUpdate(delta: number): void {}

  public getSignature(): number {
    return this.requiredSignature;
  }

  public onCleanup(): void {}

  public static getInstance(): ExampleSystem {
    if (!this._instance) {
      this._instance = new ExampleSystem();
    }
    return this._instance;
  }
}
