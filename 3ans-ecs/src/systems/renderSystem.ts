// systems/RenderSystem.ts
import { System } from "@3ans-ecs/core/system";
import * as THREE from "three";

export class RenderSystem extends System {
  private static _instance: RenderSystem;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private constructor() {
    super();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202020);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  public init(): void {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);

    //Model Importing

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  public update(delta: number): void {}

  public static getInstance(): RenderSystem {
    if (!this._instance) {
      this._instance = new RenderSystem();
    }
    return this._instance;
  }

  public getSignature(): number {
    return this.requiredSignature;
  }

  public getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public cleanup(): void {}
}
