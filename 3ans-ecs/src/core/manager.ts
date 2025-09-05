import { Master } from "@3ans-ecs/engine/ecs-master";

// core/manager.ts
export abstract class Manager {
  protected get master(): Master {
    return Master.getInstance();
  }
  // Optional lifecycle
  init?(): void;
  update?(delta: number): void;
  cleanup?(): void;
}
