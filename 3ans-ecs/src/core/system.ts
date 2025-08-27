// System.ts
import { Entity } from "./entity";

export abstract class System {
  entities: Entity[] = [];
  requiredSignature: number = 0;

  abstract init(): void;
  abstract update(delta: number): void;
  abstract cleanup(): void;
}
