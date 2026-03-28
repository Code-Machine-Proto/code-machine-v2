import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { resolve } from "path";

export default defineConfig({
  plugins: [solid(), tailwindcss(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "codemachine-simulator": resolve(__dirname, "../simulator/pkg/codemachine_simulator"),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, ".."), resolve(__dirname)],
    },
  },
  build: {
    target: "esnext",
  },
});
