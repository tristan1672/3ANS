import { RenderSystem } from "../systems/renderSystem";

export class ECSWorld {
  private render = RenderSystem.getInstance();

  init(canvas: HTMLCanvasElement) {}

  dispose() {}
}
