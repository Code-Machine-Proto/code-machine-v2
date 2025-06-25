import type { Dispatch, SetStateAction } from "react";

/**
 * Interface pour un état provenant de useState
 */
export type booleanState = [ boolean, Dispatch<SetStateAction<boolean>>];

/**
 * Paramètres du panneau d'exécution
 */
export interface ExecutionControlProps {
    memoryState: booleanState,
    visualSetting: booleanState,
}
