import { defineConfig } from '@tanstack/start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    preset: 'vercel',
  },
  tsr: {
    appDirectory: './src',
    routesDirectory: './src/routes',
  },
  vite: {
    plugins: [
      viteTsConfigPaths(),
      tailwindcss(),
    ],
  },
})
