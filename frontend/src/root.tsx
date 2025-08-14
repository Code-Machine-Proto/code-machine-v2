import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";
import "./app.css";
import Header from "@src/components/Header";
import { CodeProvider } from "./components/code/CodeProvider";
import { SnackBarProvider } from "./components/SnackBarProvider";
import { ConfirmationModalProvider } from "./components/ConfirmationModal";

/**
 * Disposition de base de l'application est affiché sur toutes les pages.
 * Aucun besoin de l'appelé React-Router l'appel lorsqu'il compile l'application.
 * 
 * @prop children - Le restant de l'application
 * @returns le composant React qui sert de base à l'application
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-dvh overflow-hidden">
        { children }
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * React-Router l'ajoute dans le layout pour afficher l'application.
 * Nul besoin de l'appelé.
 * @returns Une outlet qui affiche le reste de l'application
 */
export default function App() {
    return (
      <SnackBarProvider>
        <Header />
        <CodeProvider>
          <ConfirmationModalProvider>
            <Outlet />
          </ConfirmationModalProvider>
        </CodeProvider>
      </SnackBarProvider>
    );
}

export function ErrorBoundary() {
  return <p>Erreur inconnu</p>;
}
