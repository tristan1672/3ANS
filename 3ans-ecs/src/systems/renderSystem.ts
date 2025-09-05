// systems/RenderSystem.ts
import { TransformComponent } from "@3ans-ecs/components/transformComponent";
import { MeshComponent } from "@3ans-ecs/components/meshComponent";
import { System } from "@3ans-ecs/core/systems/system";
import * as THREE from "three";

export class RenderSystem extends System {
  static readonly requiredComponents = [TransformComponent, MeshComponent];

  private static _instance: RenderSystem;

  private _renderer: THREE.WebGLRenderer | null = null;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;

  // Will be set when renderer is created
  private _domElement: HTMLCanvasElement | null = null;

  private constructor() {
    super();
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x202020);

    this._camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // aspect = 1 for now
    this._camera.position.z = 5;
  }

  /**
   * Create or attach renderer to existing canvas
   */
  public initRenderer(canvas?: HTMLCanvasElement): void {
    if (this._renderer) return;

    // ✅ Now safe: we're in browser, window exists
    const width = window.innerWidth;
    const height = window.innerHeight;

    this._renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this._renderer.setSize(width, height);

    this._domElement = this._renderer.domElement;

    // ✅ Update camera with correct aspect
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    // Start render loop
    this.animate();
  }

  public getDomElement(): HTMLCanvasElement {
    if (!this._domElement) {
      throw new Error("Renderer not initialized. Call initRenderer() first.");
    }
    return this._domElement;
  }

  public getScene(): THREE.Scene {
    return this._scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  private animate = () => {
    // Optional: onUpdate for syncing transforms
    this.onUpdate(0.016);

    this._renderer?.render(this._scene, this._camera);
    requestAnimationFrame(this.animate);
  };

  protected onInit(): void {}

  protected onUpdate(delta: number): void {
    // Sync entities with TransformComponent + MeshComponent
    // this.forEntities([TransformComponent, MeshComponent], (entity) => {
    //   const transform = entity.getComponent(TransformComponent);
    //   const meshComp = entity.getComponent(MeshComponent);
    //   meshComp.mesh.position.copy(transform.position);
    //   meshComp.mesh.quaternion.copy(transform.rotation);
    // });
  }

  public resize(width: number, height: number): void {
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer?.setSize(width, height);
  }

  public onCleanup(): void {
    if (this._renderer) {
      this._renderer.dispose();
      this._renderer = null;
    }
    this._scene.clear();
    this._domElement = null;
  }

  public static getInstance(): RenderSystem {
    if (!this._instance) {
      this._instance = new RenderSystem();
    }
    return this._instance;
  }
}
