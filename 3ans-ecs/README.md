# 3ans-ecs

Framework built on TypeScript using ECS software architecture concepts.

## Core: explain ECS concepts briefly

Entities

Components

Systems

ECS drawing Here


## Events

EventManager
Event base

Event Example:
```

[Mouse Move]
     ↓
RaycastSystem → casts ray
     ↓
Hit entity with RaycastTargetComponent?
     ↓ Yes
Emit RaycastEvent(entity, point, distance)
     ↓
HoverSystem listens → sets entity.hoverComponent.hovered = true
     ↓
RenderSystem sees hover state → updates material
     ↓
Visual feedback: object glows
```