import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Tableau des routes.
 * Ce tableau utilise la syntaxe de React-Router framework mode.
 * Ajouter des routes ici.
 */
export default [
    index("routes/home.tsx"),
    route("processor", "./routes/processor/processor.tsx"),
] satisfies RouteConfig;
