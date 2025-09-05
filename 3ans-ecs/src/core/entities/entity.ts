export type Entity = number;

export class EntityData {
  id: Entity;
  signature: number = 0;
  constructor(id: Entity) {
    this.id = id;
  }
}
