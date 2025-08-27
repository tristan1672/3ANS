// ComponentManager.ts

export class ComponentManager {
  private componentBits = new Map<string, number>();
  private nextBit = 0;

  registerComponent(componentName: string): number {
    if (this.componentBits.has(componentName))
      return this.componentBits.get(componentName)!;
    const bit = 1 << this.nextBit;
    this.componentBits.set(componentName, bit);
    this.nextBit++;
    return bit;
  }

  getBit(componentName: string): number {
    return this.componentBits.get(componentName) ?? 0;
  }
}
