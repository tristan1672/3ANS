// TransformComponent.ts
export class TransformComponent {
    x: Float32Array;
    y: Float32Array;
    z: Float32Array;
    rx: Float32Array;
    ry: Float32Array;
    rz: Float32Array;
    sx: Float32Array;
    sy: Float32Array;
    sz: Float32Array;

    constructor(maxEntities: number) {
        this.x = new Float32Array(maxEntities);
        this.y = new Float32Array(maxEntities);
        this.z = new Float32Array(maxEntities);
        this.rx = new Float32Array(maxEntities);
        this.ry = new Float32Array(maxEntities);
        this.rz = new Float32Array(maxEntities);
        this.sx = new Float32Array(maxEntities).fill(1);
        this.sy = new Float32Array(maxEntities).fill(1);
        this.sz = new Float32Array(maxEntities).fill(1);
    }
}
