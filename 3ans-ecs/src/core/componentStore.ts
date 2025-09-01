// ComponentStore.ts
export class ComponentStore<T> {
  private components = new Map<number, T>();

  add(entityId: number, component: T): void {
    this.components.set(entityId, component);
  }

  get(entityId: number): T | undefined {
    return this.components.get(entityId);
  }

  remove(entityId: number): void {
    this.components.delete(entityId);
  }

  has(entityId: number): boolean {
    return this.components.has(entityId);
  }

  entries(): IterableIterator<[number, T]> {
    return this.components.entries();
  }
}
