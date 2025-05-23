import type { Config } from "@react-router/dev/config";

/**
 * Configuration de react-router
 * Laisser ssr: false, car cela permets d'avoir
 * un frontend 100% côté client.
 */
export default {
    appDirectory: "src",
    ssr: false,
} satisfies Config;
