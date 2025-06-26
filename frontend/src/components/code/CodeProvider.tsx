import { DEFAULT_EXECUTION_STATE, DEFAULT_SOURCE_CODE } from "@src/constants/CodeProvider";
import type { CodeInterface, SimulationState } from "@src/interface/CodeInterface";
import { CodeAction, type ActionFunction, type CodePayload, type DispatchCode } from "@src/interface/DispatchCode";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { createContext, useReducer, type ReactNode } from "react";

/**
 * Contexte pour accéder au valeur du code et son état
 */
export const CodeContext = createContext<CodeInterface>(DEFAULT_SOURCE_CODE);

/**
 * Permets d'obtenir le dispatch pour effectuer des actions
 */
export const DispatchCodeContext = createContext<DispatchCode>(()=>{});

/**
 * Contexte de l'exécution du code en cours
 */
export const ExecutionContext = createContext<Array<ProcessorStep>>(DEFAULT_EXECUTION_STATE);

/**
 * Étape courante de l'exécution
 */
export const StepContext = createContext<number>(0);

/**
 * Permets au enfant d'utiliser les deux contextes ainsi que de créer le reducer
 * @prop children - Noeuds à l'intérieur lors de son utilisation
 * @returns l'élément qui distribue les deux contextes
 */
export function CodeProvider({ children }: { children: ReactNode}) {
    const [ state, dispatch ] = useReducer(codeReducer, { codeState: DEFAULT_SOURCE_CODE, executionState: DEFAULT_EXECUTION_STATE, currentStep: 0 });
    return(
        <CodeContext.Provider value={ state.codeState } >
            <StepContext value={state.currentStep } >
                <ExecutionContext.Provider value={ state.executionState } >
                    <DispatchCodeContext.Provider value={ dispatch } >
                        { children }
                    </DispatchCodeContext.Provider>
                </ExecutionContext.Provider>
            </StepContext>
        </CodeContext.Provider>
    );
}

const actionMap = new Map<CodeAction, ActionFunction>();
actionMap.set(CodeAction.CHANGE_CODE, changeCode);
actionMap.set(CodeAction.CHANGE_PROCESSOR, changeProcessor);
actionMap.set(CodeAction.FORWARD, forward);
actionMap.set(CodeAction.BACKWARD, backward);
actionMap.set(CodeAction.TO_START, toStart);
actionMap.set(CodeAction.TO_END, toEnd);
actionMap.set(CodeAction.CHANGE_EXECUTED_CODE, changeExecutedCode);

/**
 * Associe le type d'action avec la bonne fonction pour mettre à jour l'état
 * 
 * @param state - État courant
 * @param action - Action à prendre par la logique de code
 * @returns Le prochain état
 */
function codeReducer(state: SimulationState, action: CodePayload): SimulationState {
    const actionFunction = actionMap.get(action.type);
    if (actionFunction) {
        return actionFunction(state, action);
    }
    throw new Error("L'action n'a pas été implémenté");
}

/**
 * Change l'état courant du code écrit par l'utilisateur 
 * @param state État courant
 * @param action Entrée pour permettre de changer le code
 * @returns le prochain état
 */
function changeCode(state: SimulationState, action: CodePayload): SimulationState {
    if (action.code === "" || action.code) {
        return { ...state, codeState: { ...state.codeState, code: action.code, lines: changeLineTotal(action.code) } };
    }
    return { ...state };
}

/**
 * Permets de transformer un input de texte en tableau de ligne
 * @param code code écrit sur plusieurs
 * @returns code séparé par ligne dans un tableau
 */
function changeLineTotal(code: string): Array<string> {
    return code.split("\n");
}

/**
 * Permets de changer le processeur utilisé
 * @param state État courant
 * @param action Entrée permettant de changer vers le bon processeur
 * @returns le prochain état
 */
function changeProcessor(state: SimulationState, action: CodePayload): SimulationState {
    if (action.processorId) {
        return { ...state, codeState: { ...state.codeState ,processorId: action.processorId }};
    }
    return { ...state };
}

/**
 * Avance d'une étape l'exécution de la simulation
 * @param state État courant
 * @returns le prochain état 
 */
function forward(state: SimulationState): SimulationState {
    if ( state.currentStep + 1 < state.executionState.length ) {
        return { ...state, currentStep: state.currentStep + 1 };
    }
    return { ... state };
}

/**
 * Recule d'une étape l'exécution de la simulation
 * @param state état courant
 * @returns le prochain état
 */
function backward(state: SimulationState): SimulationState {
    if ( state.currentStep - 1 >= 0 ) {
        return { ...state, ...state.executionState, currentStep: state.currentStep - 1 };
    }
    return { ...state };
}

/**
 * Réinitialise le compteur d'exécution
 * @param state l'état courant
 * @returns le prochain état
 */
function toStart(state: SimulationState): SimulationState {
    return { ...state, currentStep: 0 };
}

/**
 * Envoi le compteur à la fin de l'exécution de la simulation
 * @param state l'état courant
 * @returns le prochain état 
 */
function toEnd(state: SimulationState): SimulationState {
    return { ...state, currentStep: state.executionState.length - 1 };
}

/**
 * Permets de changé l'état du code compilé qui est à exécuter
 * @param state l'état courant
 * @param action contient le code compilé
 * @returns le prochain état
 */
function changeExecutedCode(state: SimulationState, action: CodePayload): SimulationState {
    if ( action.executedCode ) {
        return { ...state, executionState: action.executedCode };
    }
    return { ...state };
}
