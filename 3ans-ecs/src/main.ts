// main.ts
import { Engine } from "./engine/ecs-engine";

// Engine State
type EngineState = "Loading" | "Running" | "Paused" | "Error" | "Shutdown";

class AppState {
  state: EngineState = "Loading";
  error: Error | null = null;
  startTime: number = performance.now();
  frameCount: number = 0;

  set(state: EngineState, error?: Error): void {
    console.log(`[AppState] ${this.state} → ${state}`);
    this.state = state;
    if (error) this.error = error;
  }
}

const appState = new AppState();

// Main Function
async function main() {
  const engine = Engine.getInstance();

  // Handle initialization
  try {
    appState.set("Loading");

    // This will register components, systems, etc.
    engine.init();

    appState.set("Running");
  } catch (err) {
    appState.set("Error", err as Error);
    console.error("Failed to initialize engine", err);
    return;
  }

  // Game Loop with Delta Time
  let lastTime = performance.now();

  function update() {
    if (appState.state === "Paused") {
      requestAnimationFrame(update);
      return;
    }

    if (appState.state === "Running") {
      const now = performance.now();
      const delta = (now - lastTime) / 1000; // seconds
      lastTime = now;

      try {
        engine.update(delta);
        setTimeout(update, 16.67);
        appState.frameCount++;
      } catch (err) {
        appState.set("Error", err as Error);
        console.error("Error during engine update", err);
        return;
      }
    }

    // Continue loop
  }

  // Start loop
  update();
}

main();
