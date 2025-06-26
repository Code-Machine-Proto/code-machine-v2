import type { ProcessorStep } from "./ProcessorStep";

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
    currentStep: number,
}

/**
 * Les identifiants de tous le processeurs
 */
export enum ProcessorId {
    ACCUMULATOR = 0,
    MA_ACCUMULATOR,
    RISC,
} 
