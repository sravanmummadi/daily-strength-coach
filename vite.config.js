import { defineConfig } from "vite";

export default defineConfig({
  base: "/daily-strength-coach/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
