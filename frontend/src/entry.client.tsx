import { startTransition, StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createHashRouter, RouterProvider, type ClientActionFunction, type ClientActionFunctionArgs } from "react-router";
import { HydratedRouter } from "react-router/dom";
import Home from "./routes/home";
import App from "./root";
import Processor from "./routes/processor/Processor";
import CompileAction, { clientAction } from "./routes/processor/CompileAction";
import AccumulatorProcessor from "./routes/processor/accumulator/Accumulator";
import MaProcessor from "./routes/processor/with-ma/MaProcessor";
import PolyRiscProcessor from "./routes/processor/polyrisc/PolyRisc";


startTransition(() => {
  if (import.meta.env.MODE === "website") {
    hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
    );
  } else {
    const router = createHashRouter([{
      path: "/",
      Component: App,
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
    }]); 
    createRoot(document).render(
      <RouterProvider router={router}/>
    );
  }
});
