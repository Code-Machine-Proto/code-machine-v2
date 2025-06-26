import type { ExecutionButtonProps } from "@src/interface/props/ExecutionButton";

/**
 * Composant pour stylisé les boutons de jouer/pause dans la page des processeurs
 * 
 * @prop children - Un svg sans sa balise svg
 * @returns un composant avec un svg stylisé
 */
export default function ExecutionButton({ children, onClick }: ExecutionButtonProps) {
    return (
        <button className="controlBtn size-[3rem] hover:bg-main-900" onClick={onClick}>
            <svg fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" className="size-[2rem]">
                { children }
            </svg>
        </button>
    )
}
