import type { ActionDispatch } from "react";
import type CodeInterface from "./CodeInterface";

/**
 * Type du dispatch du reducer
 */
export type DispatchCode = ActionDispatch<[action: CodePayload]>;

/**
 * Différentes actions possibles sur l'application
 */
export enum CodeAction {
    CHANGE_CODE = 'change',
};

/**
 * Paramètre d'entrée pour le reducer
 */
export interface CodePayload {
    code: string,
    type: CodeAction,
};

/**
 * Le type de fonction pour gérer les différentes actions
 */
export type ActionFunction = (state: CodeInterface, code: string) => CodeInterface;