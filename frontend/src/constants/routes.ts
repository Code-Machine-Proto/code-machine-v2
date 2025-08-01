import App, { ErrorBoundary } from "@src/root";
import Home from "@src/routes/home";
import AccumulatorProcessor from "@src/routes/processor/accumulator/Accumulator";
import CompileAction, { clientAction } from "@src/routes/processor/CompileAction";
import PolyRiscProcessor from "@src/routes/processor/polyrisc/PolyRisc";
import Processor from "@src/routes/processor/Processor";
import MaProcessor from "@src/routes/processor/with-ma/MaProcessor";
import type { ClientActionFunctionArgs, RouteObject } from "react-router";

/**
 * Routes pour la version electron de l'application
 */
export const routes: RouteObject[] = [{
      path: "/",
      Component: App,
      ErrorBoundary: ErrorBoundary,
      children: [
        { index: true, Component: Home },
        { 
          path: "/processor",
          Component: Processor,
          action: async ({ request }) => { return await clientAction({ request: request } as ClientActionFunctionArgs) },
          children: [
            { index: true, Component: CompileAction},
            {
              path: "accumulator",
              Component: AccumulatorProcessor,
            },
            {
              path: "with-ma",
              Component: MaProcessor,
            },
            {
              path: "polyrisc",
              Component: PolyRiscProcessor,
            }
          ],
        }
      ],
    }];
