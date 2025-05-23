import type { ReactNode } from "react"

/**
 * Composant pour stylisé les boutons de jouer/pause dans la page des processeurs
 * 
 * @param children - Un svg sans sa balise svg
 * @returns un composant avec un svg stylisé
 */
export default function ExecutionButton({ children }: { children: ReactNode }) {
    return (
        <button className="controlBtn size-[3rem] hover:bg-main-900">
            <svg fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" className="size-[2rem]">
                { children }
            </svg>
            </button>
    )
}