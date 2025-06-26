import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
    const base = mode === "electron" ? "./" : "/";
    return {
        plugins: [tailwindcss(), !process.env.VITEST && reactRouter(), tsconfigPaths()],
        envDir: "./environment",
        appType: "spa",
        resolve: {
            alias: {
                "@src": path.resolve(__dirname, "src"),
            }
        },
        base: base,
        test: {
            browser: {
                enabled: true,
                provider: 'playwright',
                instances: [
                { browser: 'chromium' },
                ],
            },
        },
    };
});
