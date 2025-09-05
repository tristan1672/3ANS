// events/RaycastEvent.ts
import { Event } from "./base/event";
import { Entity } from "@3ans-ecs/core/entities/entity";

export class RaycastEvent implements Event {
  constructor(
    public readonly entity: Entity, // the entity that was hit
    public readonly point: { x: number; y: number; z: number }, // world position
    public readonly distance: number // distance from camera
  ) {}
}
