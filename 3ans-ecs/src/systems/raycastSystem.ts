// systems/RaycastSystem.ts
import { System } from "@3ans-ecs/core/systems/system";
import * as THREE from "three";
import { RaycastEvent } from "@3ans-ecs/events/raycastEvent";
import { MeshComponent } from "@3ans-ecs/components/meshComponent";
import { RenderSystem } from "./renderSystem";

export class RaycastSystem extends System {
  static readonly requiredComponents = [MeshComponent]
  private static _instance: RaycastSystem
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  protected onInit(): void {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  protected onUpdate(delta: number): void {
    const camera = this.master?.getSystem(RenderSystem)?.getCamera(); // adjust based on your setup
    if (!camera) return;

    this.raycaster.setFromCamera(this.mouse, camera);

    // Query entities that can be raycasted
    const candidates = this.entities.filter((entity) =>
      this.master?.hasComponent(entity, MeshComponent)
    );

    for (const entity of candidates) {
      const render = this.master?.getComponent(entity, MeshComponent);
      if (!render) continue;

      const intersects = this.raycaster.intersectObject(render.mesh, true);
      if (intersects.length > 0) {
        const hit = intersects[0];

        // Emit event with entity and hit data
        this.engineEvents.emit(
          new RaycastEvent(
            entity,
            {
              x: hit.point.x,
              y: hit.point.y,
              z: hit.point.z,
            },
            hit.distance
          )
        );
        break; // First hit only (painter’s algorithm)
      }
    }
  }

  protected onCleanup(): void {}

  public static getInstance(): RaycastSystem {
    if (!this._instance) {
      this._instance = new RaycastSystem();
    }
    return this._instance;
  }
}
