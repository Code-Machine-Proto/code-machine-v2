import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

/**
 * Tableau des routes.
 * Ce tableau utilise la syntaxe de React-Router framework mode.
 * Ajouter des routes ici.
 */
export default [
    index("./routes/home.tsx"),
    ...prefix("processor", [
        layout("./routes/processor/Processor.tsx", [
            index("./routes/processor/CompileAction.tsx"),
            route("accumulator", "./routes/processor/accumulator/Accumulator.tsx"),
            route("with-ma", "./routes/processor/with-ma/MaProcessor.tsx"),
            route("polyrisc", "./routes/processor/polyrisc/PolyRisc.tsx"),
        ]),
    ]),
] satisfies RouteConfig;
