//engine.ts ecs driver
import { Master } from "./ecs-master";

export class Engine {
  private static _instance: Engine;
  private master: Master;

  private constructor() {
    this.master = Master.getInstance();
  }

  init(): void {
    this.master.init()
  }

  update(delta: number): void {
    this.master.update(delta);
  }

  cleanup(): void {
    this.master.cleanup();
  }

  //Singleton accessor
  public static getInstance(): Engine {
    if (!this._instance) this._instance = new Engine();
    return this._instance;
  }
}
