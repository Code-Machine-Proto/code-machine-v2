import type { ActionDispatch } from "react";
import type { ProcessorStep } from "./ProcessorStep";
import type Processor from "@src/class/Processor";
import type { PlayerMode } from "./StepControl";

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
    PLAY_AND_PAUSE,
    CHANGE_MODE,
    RESET_CODE,
};

/**
 * Paramètre d'entrée pour le reducer
 */
export interface CodePayload {
    code?: string,
    executedCode?: Array<ProcessorStep>,
    newProcessor?: Processor,
    mode?: PlayerMode, 
    type: CodeAction,
};

/**
 * Le type de fonction pour gérer les différentes actions
 */
export type ActionFunction = (state: Processor, action: CodePayload) => Processor;
