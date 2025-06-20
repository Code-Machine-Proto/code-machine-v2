import type Processor from "@src/class/Processor";
import type { ProcessorStep } from "./ProcessorStep";

/**
 * État de la simulation
 */
export interface SimulationState {
    codeState: Processor,
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
