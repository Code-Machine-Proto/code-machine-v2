import { startTransition, StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { HydratedRouter } from "react-router/dom";
import { routes } from "./constants/routes";


startTransition(() => {
  if (import.meta.env.MODE === "website") {
    hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
    );
  } else {
    const router = createHashRouter(routes); 
    createRoot(document).render(
      <RouterProvider router={router}/>
    );
  }
});
