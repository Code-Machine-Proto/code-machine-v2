import type { ActionDispatch } from "react";
import type { ProcessorId, SimulationState } from "./CodeInterface";

/**
 * Type du dispatch du reducer
 */
export type DispatchCode = ActionDispatch<[action: CodePayload]>;

/**
 * Différentes actions possibles sur l'application
 */
export enum CodeAction {
    CHANGE_CODE,
    CHANGE_PROCESSOR,
    TO_START,
    TO_END,
    FORWARD,
    BACKWARD,
};

/**
 * Paramètre d'entrée pour le reducer
 */
export interface CodePayload {
    code?: string,
    processorId?: ProcessorId,
    type: CodeAction,
};

/**
 * Le type de fonction pour gérer les différentes actions
 */
export type ActionFunction = (state: SimulationState, action: CodePayload) => SimulationState;