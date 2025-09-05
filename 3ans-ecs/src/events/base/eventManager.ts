// events/EventManager.ts
import { Event } from "./event";

export class EventManager {
  private listeners = new Map<string, Array<(event: any) => void>>();

  emit(event: Event): void {
    const type = event.constructor.name;
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach((fn) => fn(event));
    }
  }

  on<T extends Event>(
    eventType: new (...args: any[]) => T,
    callback: (event: T) => void
  ): void {
    const type = eventType.name;
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  off<T extends Event>(
    eventType: new (...args: any[]) => T,
    callback: (event: T) => void
  ): void {
    const type = eventType.name;
    const handlers = this.listeners.get(type);
    if (handlers) {
      const index = handlers.indexOf(callback as any);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  cleanup(): void {
    this.listeners.clear();
  }
}
