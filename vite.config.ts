import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base is "/standing/" for the production build so assets resolve correctly on
// GitHub Pages (https://<user>.github.io/standing/), and "/" for local dev.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/standing/" : "/",
  server: { port: 5185, strictPort: true, host: true },
}));
