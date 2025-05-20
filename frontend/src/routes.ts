import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("processor", "./routes/processor/processor.tsx"),
] satisfies RouteConfig;
