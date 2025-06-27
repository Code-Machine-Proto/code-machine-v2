import Processor from "@src/class/Processor";
import type { SimulationState } from "@src/interface/CodeInterface";
import { storeCode } from "@src/module-store/CodeStore";
import { createContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { DEFAULT_EXECUTION_STATE, DEFAULT_SOURCE_CODE, DEFAULT_STEP_CONTROL, EXECUTION_END, EXECUTION_START, INCREMENT_SIZE_EXECUTION, INCREMENT_SIZE_REGULAR, PLAY_INTERVALL, REGULAR_END, REGULAR_START } from "@src/constants/CodeProvider";
import { CodeAction, type ActionFunction, type CodePayload, type DispatchCode } from "@src/interface/DispatchCode";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { PlayerMode, type StepControl } from "@src/interface/StepControl";

/**
 * Contexte pour accéder au valeur du code et son état
 */
export const CodeContext = createContext<Processor>(DEFAULT_SOURCE_CODE);

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
export const StepContext = createContext<StepControl>(DEFAULT_STEP_CONTROL);

/**
 * Permets au enfant d'utiliser les deux contextes ainsi que de créer le reducer
 * @prop children - Noeuds à l'intérieur lors de son utilisation
 * @returns l'élément qui distribue les deux contextes
 */
export function CodeProvider({ children }: { children: ReactNode }) {
    const [ state, dispatch ] = useReducer(codeReducer, { codeState: DEFAULT_SOURCE_CODE, executionState: DEFAULT_EXECUTION_STATE, currentStep: DEFAULT_STEP_CONTROL });

    const playingRef = useRef<boolean>(state.currentStep.isPlaying);

    function callNext() {
        if( playingRef.current ) {
            dispatch({ type: CodeAction.FORWARD });
            setTimeout(callNext, PLAY_INTERVALL);
        }
    }

    useEffect(() => {
        playingRef.current = state.currentStep.isPlaying;
        if ( state.currentStep.isPlaying ) {
            setTimeout(callNext, PLAY_INTERVALL);
        }
    }, [state.currentStep.isPlaying, dispatch]);

    return(
        <CodeContext.Provider value={ state.codeState } >
            <StepContext value={ state.currentStep } >
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
actionMap.set(CodeAction.PLAY_AND_PAUSE, playAndPause);
actionMap.set(CodeAction.CHANGE_MODE, changeMode);

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
        storeCode(state.codeState.processorId, action.code);
        return { ...state, codeState: { ...state.codeState, code: action.code, lines: action.code.split("\n") } as Processor };
    }
    return { ...state };
}

/**
 * Permets de changer le processeur utilisé
 * @param state État courant
 * @param action Entrée permettant de changer vers le bon processeur
 * @returns le prochain état
 */
function changeProcessor(state: SimulationState, action: CodePayload): SimulationState {
    if (action.newProcessor) {
        return { ...state, codeState: action.newProcessor };
    }
    return { ...state };
}

/**
 * Avance d'une étape l'exécution de la simulation
 * @param state État courant
 * @returns le prochain état 
 */
function forward(state: SimulationState): SimulationState {
    const inc = state.currentStep.mode === PlayerMode.regular ? INCREMENT_SIZE_REGULAR : INCREMENT_SIZE_EXECUTION;
    if ( state.currentStep.count + inc < state.executionState.length ) {
        return { ...state, currentStep: { ...state.currentStep, count: state.currentStep.count + inc } };
    }
    return { ... state };
}

/**
 * Recule d'une étape l'exécution de la simulation
 * @param state état courant
 * @returns le prochain état
 */
function backward(state: SimulationState): SimulationState {
    const inc = state.currentStep.mode === PlayerMode.regular ? INCREMENT_SIZE_REGULAR : INCREMENT_SIZE_EXECUTION;
    if ( state.currentStep.count - inc >= 0 ) {
        return { ...state, currentStep: { ...state.currentStep, count: state.currentStep.count - inc } };
    }
    return { ...state };
}

/**
 * Réinitialise le compteur d'exécution
 * @param state l'état courant
 * @returns le prochain état
 */
function toStart(state: SimulationState): SimulationState {
    const start = state.currentStep.mode === PlayerMode.regular ? REGULAR_START : EXECUTION_START;
    return { ...state, currentStep: { ...state.currentStep, count: start } };
}

/**
 * Envoi le compteur à la fin de l'exécution de la simulation
 * @param state l'état courant
 * @returns le prochain état 
 */
function toEnd(state: SimulationState): SimulationState {
    const end = state.currentStep.mode === PlayerMode.regular ? REGULAR_END : EXECUTION_END;
    return { ...state, currentStep: { ...state.currentStep, count: state.executionState.length - end } };
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

/**
 * Change l'état de lecture automatique
 * @param state - l'état courant
 * @returns le prochain état
 */
function playAndPause(state: SimulationState): SimulationState {
    return { ...state, currentStep: { ...state.currentStep, isPlaying: !state.currentStep.isPlaying } };
}

/**
 * Change le mode d'exécution du code compilé
 * @param state - l'état courant
 * @param action - contient le prochain mode
 * @returns le prochain état
 */
function changeMode(state: SimulationState, action: CodePayload): SimulationState {
    if( action.mode ) {
        return { ...state, currentStep: { ...state.currentStep, mode: action.mode, count: action.mode === PlayerMode.regular ? REGULAR_START : EXECUTION_START } };
    }
    return { ...state };
}
