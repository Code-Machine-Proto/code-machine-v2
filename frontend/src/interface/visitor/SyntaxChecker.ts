import type { SyntaxState } from "@src/constants/SyntaxChecker/SyntaxCheckerState";
import type { ComposedToken, ComposedTokenType, Token } from "./Token";

export enum CheckerAction {
    SHIFT,
    REDUCE,
    ERROR,
    ACCEPT,
    OP_REDUCE,
}

export interface SyntaxTableEntry {
    type: CheckerAction,
    number?: number,
    message?: string,
    reducedAddition?: ComposedTokenType,
}

export type SyntaxStackAction = (
    input: Array<Token | ComposedToken>,
    checkerStack: Array<Token | ComposedToken>,
    stateStack: Array<SyntaxState>,
) => boolean;