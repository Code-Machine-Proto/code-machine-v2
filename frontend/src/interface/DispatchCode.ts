import type { ActionDispatch } from "react";
import type CodeInterface from "./CodeInterface";

export type DispatchCode = ActionDispatch<[action: CodePayload]>;

export enum CodeAction {
    CHANGE_CODE = 'change',
};

export interface CodePayload {
    code: string,
    type: CodeAction,
};

export type ActionFunction = (state: CodeInterface, code: string) => CodeInterface;