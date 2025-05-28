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

export const ExecutionContext = createContext<Array<ProcessorStep>>(DEFAULT_EXECUTION_STATE);

export const StepContext = createContext<number>(0);

/**
 * Permets au enfant d'utiliser les deux contextes ainsi que de créer le reducer
 * @param children - Noeuds à l'intérieur lors de son utilisation
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

/**
 * Associe le type d'action avec la bonne fonction pour mettre à jour l'état
 * 
 * @param state - État courant
 * @param action - Action à prendre par la logique de code
 * @returns Le prochaine état
 */
function codeReducer(state: SimulationState, action: CodePayload): SimulationState {
    const actionFunction = actionMap.get(action.type);
    if (actionFunction) {
        return actionFunction(state, action);
    }
    throw new Error("L'action n'a pas été implémenté");
}

function changeCode(state: SimulationState, action: CodePayload): SimulationState {
    if (action.code === "" || action.code) {
        return { ...state, codeState: { ...state.codeState, code: action.code, lines: changeLineTotal(action.code) } };
    }
    return { ...state };
}

function changeLineTotal(code: string): Array<string> {
    return code.split("\n");
}

function changeProcessor(state: SimulationState, action: CodePayload): SimulationState {
    if (action.processorId) {
        return { ...state, codeState: { ...state.codeState ,processorId: action.processorId }};
    }
    return { ...state };
}

function forward(state: SimulationState, _: CodePayload): SimulationState {
    if ( state.currentStep + 1 >= state.executionState.length ) {
        return { ...state, currentStep: state.currentStep + 1 };
    }
    return { ... state };
}

function backward(state: SimulationState, _: CodePayload): SimulationState {
    if ( state.currentStep - 1 < 0 ) {
        return { ...state, currentStep: state.currentStep - 1 };
    }
    return { ...state };
}

function toStart(state: SimulationState, _: CodePayload): SimulationState {
    return { ...state, currentStep: 0 };
}

function toEnd(state: SimulationState, _: CodePayload): SimulationState {
    return { ...state, currentStep: state.executionState.length - 1 };
}