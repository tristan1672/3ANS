// events/ComponentEvent.ts
import { Event } from "./base/event";

export class ComponentAddedEvent implements Event {
  constructor(
    public readonly entityId: number,
    public readonly componentBit: number
  ) {}
}

export class ComponentRemovedEvent implements Event {
  constructor(
    public readonly entityId: number,
    public readonly componentBit: number
  ) {}
}