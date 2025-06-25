import type { MouseEventHandler, ReactNode } from "react";

/**
 * Paramètre du bouton d'exécution
 */
export interface ExecutionButtonProps {
    children: ReactNode,
    onClick: MouseEventHandler<HTMLButtonElement>,
}
