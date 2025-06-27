import { ProcessorId, type CodeInterface } from "@src/interface/CodeInterface";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { PlayerMode, type StepControl } from "@src/interface/StepControl";

/**
 * Code source par défaut
 */
export const DEFAULT_SOURCE_CODE: CodeInterface = {
    code: "",
    lines: [""],
    processorId: ProcessorId.ACCUMULATOR,
};

/**
 * État d'exécution par défaut
 */
export const DEFAULT_EXECUTION_STATE: Array<ProcessorStep> = [{
    pcState: 0,
    irState: 0,
    stimulatedMemory: 0,
    instructionState: 0,
    memoryState: [0],
    stimulatedLineState: -1,
}];

/**
 * État courant d'exécution par défaut
 */
export const DEFAULT_STEP_CONTROL: StepControl = {
    count: 0,
    isPlaying: false,
    mode: PlayerMode.regular,
};

/**
 * Intervalle entre chaque incrément
 */
export const PLAY_INTERVALL = 1000;

/**
 * Incrément en mode d'exécution
 */
export const INCREMENT_SIZE_EXECUTION = 3;

/**
 * Incrément en mode régulier
 */
export const INCREMENT_SIZE_REGULAR = 1;

/**
 * Index de début pour le mode régulier
 */
export const REGULAR_START = 0;

/**
 * Index de début pour le mode d'exécution
 */
export const EXECUTION_START = 2;

/**
 * Nombre à retirer à la fin pour obtenir la dernière étape
 */
export const REGULAR_END = 1;

/**
 * Nombre à retirer à la fin pour obtenir la dernière étape execute
 */
export const EXECUTION_END = 2;
