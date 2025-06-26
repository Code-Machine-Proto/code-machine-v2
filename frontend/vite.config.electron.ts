import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "build",
    emptyOutDir: false,
    ssr: 'module-electron/main.ts',
    minify: "esbuild",
  }
})