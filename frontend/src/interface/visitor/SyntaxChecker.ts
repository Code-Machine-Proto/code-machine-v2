import type { ComposedTokenType } from "./Token";

export enum CheckerAction {
    SHIFT,
    REDUCE,
    ERROR,
    WARNING,
    ACCEPT,
}

export interface SyntaxTableEntry {
    type: CheckerAction,
    number?: number,
    message?: string,
    reducedAddition?: ComposedTokenType,
}