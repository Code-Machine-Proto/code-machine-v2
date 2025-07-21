import type { ComposedTokenType } from "./Token";

export enum CheckerAction {
    SHIFT,
    REDUCE,
    ERROR,
    ACCEPT,
}

export interface SyntaxTableEntry {
    type: CheckerAction,
    number?: number,
    message?: string,
    reducedAddition?: ComposedTokenType,
}