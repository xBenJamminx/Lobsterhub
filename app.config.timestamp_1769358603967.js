// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
var app_config_default = defineConfig({
  server: {
    preset: "vercel"
  },
  tsr: {
    appDirectory: "./src",
    routesDirectory: "./src/routes"
  },
  vite: {
    plugins: [
      viteTsConfigPaths(),
      tailwindcss()
    ]
  }
});
export {
  app_config_default as default
};
