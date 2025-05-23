import type CodeInterface from "@src/interface/CodeInterface";
import { CodeAction, type ActionFunction, type CodePayload, type DispatchCode } from "@src/interface/DispatchCode";
import { createContext, useReducer, type ReactNode } from "react";

/**
 * Contexte pour accéder au valeur du code et son état
 */
export const CodeContext = createContext<CodeInterface | null>(null);
/**
 * Permets d'obtenir le dispatch pour effectuer des actions
 */
export const DispatchCodeContext = createContext<DispatchCode>(()=>{});

/**
 * Permets au enfant d'utiliser les deux contextes ainsi que de créer le reducer
 * @param children - Noeuds à l'intérieur lors de son utilisation
 * @returns l'élément qui distribue les deux contextes
 */
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

/**
 * Associe le type d'action avec la bonne fonction pour mettre à jour l'état
 * 
 * @param state - État courant
 * @param action - Action à prendre par la logique de code
 * @returns Le prochaine état
 */
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