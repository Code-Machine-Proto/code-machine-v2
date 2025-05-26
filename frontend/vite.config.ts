import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), !process.env.VITEST && reactRouter(), tsconfigPaths()],
    envDir: "./environment",
    appType: "spa",
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
        }
    },
});
