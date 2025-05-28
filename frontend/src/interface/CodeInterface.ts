import type { ProcessorStep } from "./ProcessorStep";

/**
 * État du code dans le textarea
 */
export interface CodeInterface {
    code: string,
    lines: Array<string>,
    processorId: ProcessorId,
}

export interface SimulationState {
    codeState: CodeInterface,
    executionState: Array<ProcessorStep>,
    currentStep: number,
}

export enum ProcessorId {
    ACCUMULATOR = 0,
    MA_ACCUMULATOR = 1,
    RISC = 2,
} 