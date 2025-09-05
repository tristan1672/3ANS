// ComponentStore.ts
export class ComponentStore<T> {
  private components: T[] = []; // contiguous memory
  private entityToIndex = new Map<number, number>(); // entity to component index mapping (mimic map)
  private indexToEntity: number[] = []; // reverse lookup

  add(entity: number, component: T): void {
    if (this.entityToIndex.has(entity)) {
      throw new Error("Entity already has this component");
    }

    this.components.push(component);
    const index = this.components.length - 1;
    this.entityToIndex.set(entity, index);
    this.indexToEntity[index] = entity;
  }

  remove(entity: number): void {
    const index = this.entityToIndex.get(entity);
    if (index === undefined) return;

    const last = this.components.length - 1;

    // swap-and-pop
    this.components[index] = this.components[last];
    const lastEntity = this.indexToEntity[last];

    this.entityToIndex.set(lastEntity, index);
    this.indexToEntity[index] = lastEntity;

    this.components.pop();
    this.indexToEntity.pop();
    this.entityToIndex.delete(entity);
  }

  get(entity: number): T | undefined {
    const index = this.entityToIndex.get(entity);
    return index !== undefined ? this.components[index] : undefined;
  }

  has(entity: number): boolean {
    return this.entityToIndex.has(entity);
  }

  *entries(): IterableIterator<[number, T]> {
    for (const [entityId, index] of this.entityToIndex.entries()) {
      yield [entityId, this.components[index]];
    }
  }
}
