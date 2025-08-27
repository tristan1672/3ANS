// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@3ans-ecs": path.resolve(__dirname, "../../../3ans-ecs/src"),
    },
  },
});
