import type { ActionDispatch } from "react";
import type { ProcessorId, SimulationState } from "./CodeInterface";
import type { ProcessorStep } from "./ProcessorStep";

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
    CHANGE_EXECUTED_CODE,
};

/**
 * Paramètre d'entrée pour le reducer
 */
export interface CodePayload {
    code?: string,
    executedCode?: Array<ProcessorStep>,
    processorId?: ProcessorId,
    type: CodeAction,
};

/**
 * Le type de fonction pour gérer les différentes actions
 */
export type ActionFunction = (state: SimulationState, action: CodePayload) => SimulationState;