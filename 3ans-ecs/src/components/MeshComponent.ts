import * as THREE from "three";

export class MeshComponent {
  readonly mesh: THREE.Mesh;

  constructor(mesh: THREE.Mesh) {
    this.mesh = mesh;
  }
}
