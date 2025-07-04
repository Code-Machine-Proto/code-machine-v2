import Processor from "@src/class/Processor";
import { storeCode } from "@src/module-store/CodeStore";
import { createContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { 
    DEFAULT_SOURCE_CODE,
    EXECUTION_END,
    EXECUTION_START,
    INCREMENT_SIZE_EXECUTION,
    INCREMENT_SIZE_REGULAR,
    PLAY_INTERVALL,
    REGULAR_END,
    REGULAR_START,
    DEFAULT_EXECUTION_STATE,
} from "@src/constants/CodeProvider";
import { CodeAction, type ActionFunction, type CodePayload, type DispatchCode } from "@src/interface/DispatchCode";
import { PlayerMode } from "@src/interface/StepControl";

/**
 * Contexte pour accéder au valeur du code et son état
 */
export const ProcessorContext = createContext<Processor>(DEFAULT_SOURCE_CODE);

/**
 * Permets d'obtenir le dispatch pour effectuer des actions
 */
export const DispatchProcessorContext = createContext<DispatchCode>(()=>{});

/**
 * Permets au enfant d'utiliser les deux contextes ainsi que de créer le reducer
 * @prop children - Noeuds à l'intérieur lors de son utilisation
 * @returns l'élément qui distribue les deux contextes
 */
export function CodeProvider({ children }: { children: ReactNode }) {
    const [ state, dispatch ] = useReducer(codeReducer, DEFAULT_SOURCE_CODE);

    const playingRef = useRef<boolean>(state.isPlaying);

    function callNext() {
        if( playingRef.current ) {
            dispatch({ type: CodeAction.FORWARD });
            setTimeout(callNext, PLAY_INTERVALL);
        }
    }

    useEffect(() => {
        playingRef.current = state.isPlaying;
        if ( state.isPlaying ) {
            setTimeout(callNext, PLAY_INTERVALL);
        }
    }, [state.isPlaying, dispatch]);

    return(
        <ProcessorContext.Provider value={ state } >
                    <DispatchProcessorContext.Provider value={ dispatch } >
                        { children }
                    </DispatchProcessorContext.Provider>
        </ProcessorContext.Provider>
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
actionMap.set(CodeAction.RESET_CODE, resetExecutionState);

/**
 * Associe le type d'action avec la bonne fonction pour mettre à jour l'état
 * 
 * @param state - État courant
 * @param action - Action à prendre par la logique de code
 * @returns Le prochain état
 */
function codeReducer(state: Processor, action: CodePayload): Processor {
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
function changeCode(state: Processor, action: CodePayload): Processor {
    if (action.code === "" || action.code) {
        storeCode(state.processorId, action.code);
        state.code = action.code;
        state.lines = state.splitLines();
    }
    return state.clone();
}

/**
 * Permets de changer le processeur utilisé
 * @param state État courant
 * @param action Entrée permettant de changer vers le bon processeur
 * @returns le prochain état
 */
function changeProcessor(state: Processor, action: CodePayload): Processor {
    if ( action.newProcessor && action.newProcessor.processorId != state.processorId ) {
        return action.newProcessor.clone();
    }
    return state.clone();
}

/**
 * Avance d'une étape l'exécution de la simulation
 * @param state État courant
 * @returns le prochain état 
 */
function forward(state: Processor): Processor {
    const inc = state.mode === PlayerMode.regular ? INCREMENT_SIZE_REGULAR : INCREMENT_SIZE_EXECUTION;
    if ( state.steps &&  state.count + inc < state.steps.length  ) {
        state.count += inc;
    }
    return state.clone();
}

/**
 * Recule d'une étape l'exécution de la simulation
 * @param state état courant
 * @returns le prochain état
 */
function backward(state: Processor): Processor {
    const inc = state.mode === PlayerMode.regular ? INCREMENT_SIZE_REGULAR : INCREMENT_SIZE_EXECUTION;
    if ( state.count - inc >= 0 ) {
        state.count -= inc;
    }
    return state.clone();
}

/**
 * Réinitialise le compteur d'exécution
 * @param state l'état courant
 * @returns le prochain état
 */
function toStart(state: Processor): Processor {
    const start = state.mode === PlayerMode.regular ? REGULAR_START : EXECUTION_START;
    state.count = start;
    return state.clone();
}

/**
 * Envoi le compteur à la fin de l'exécution de la simulation
 * @param state l'état courant
 * @returns le prochain état 
 */
function toEnd(state: Processor): Processor {
    const end = state.mode === PlayerMode.regular ? REGULAR_END : EXECUTION_END;
    state.count = state.steps.length - end;
    return state.clone();
}

/**
 * Permets de changé l'état du code compilé qui est à exécuter
 * @param state l'état courant
 * @param action contient le code compilé
 * @returns le prochain état
 */
function changeExecutedCode(state: Processor, action: CodePayload): Processor {
    if ( action.executedCode ) {
        state.steps = action.executedCode;
    }
    return state.clone();
}

/**
 * Change l'état de lecture automatique
 * @param state - l'état courant
 * @returns le prochain état
 */
function playAndPause(state: Processor): Processor {
    state.isPlaying = !state.isPlaying;
    return state.clone();
}

/**
 * Change le mode d'exécution du code compilé
 * @param state - l'état courant
 * @param action - contient le prochain mode
 * @returns le prochain état
 */
function changeMode(state: Processor, action: CodePayload): Processor {
    if( action.mode ) {
        state.mode = action.mode;
        state.count = action.mode === PlayerMode.regular ? REGULAR_START : EXECUTION_START;
    }
    return state.clone();
}

function resetExecutionState(state: Processor): Processor {
    state.mode = PlayerMode.regular;
    state.count = 0;
    state.isPlaying = false;
    state.steps = DEFAULT_EXECUTION_STATE;
    return state.clone();
}
