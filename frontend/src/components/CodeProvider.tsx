import type CodeInterface from "@src/interface/CodeInterface";
import { CodeAction, type ActionFunction, type CodePayload, type DispatchCode } from "@src/interface/DispatchCode";
import { createContext, useReducer, type ReactNode } from "react";

export const CodeContext = createContext<CodeInterface | null>(null);
export const DispatchCodeContext = createContext<DispatchCode>(()=>{});

export function CodeProvider({ children }: { children: ReactNode}) {
    const [ codeState, dispatch ] = useReducer(codeReducer, { code: "", lines: [""] });
    return(
        <CodeContext.Provider value={ codeState } >
            <DispatchCodeContext.Provider value={ dispatch }>
                { children }
            </DispatchCodeContext.Provider>
        </CodeContext.Provider>
    );
}

let actionMap = new Map<CodeAction, ActionFunction>();
actionMap.set(CodeAction.CHANGE_CODE, changeCode);

function codeReducer(state: CodeInterface, action: CodePayload): CodeInterface {
    const actionFunction = actionMap.get(action.type);
    if (actionFunction) {
        return actionFunction(state, action.code);
    }
    throw new Error("L'action n'a pas été implémenté");
}

function changeCode(state: CodeInterface, code: string): CodeInterface {
    return { ...state, code: code, lines: changeLineTotal(code) };
}

function changeLineTotal(code: string): Array<string> {
    return code.split("\n");
}