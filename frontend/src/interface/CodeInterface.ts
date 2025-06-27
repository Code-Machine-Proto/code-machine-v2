import type { ProcessorStep } from "./ProcessorStep";
import type { StepControl } from "./StepControl";

/**
 * État du code dans le textarea
 */
export interface CodeInterface {
    code: string,
    lines: Array<string>,
    processorId: ProcessorId,
}

/**
 * État de la simulation
 */
export interface SimulationState {
    codeState: CodeInterface,
    executionState: Array<ProcessorStep>,
    currentStep: StepControl,
}

/**
 * Les identifiants de tous le processeurs
 */
export enum ProcessorId {
    ACCUMULATOR = 0,
    MA_ACCUMULATOR,
    RISC,
} 
