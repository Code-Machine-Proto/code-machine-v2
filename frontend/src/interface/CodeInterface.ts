import type Processor from "@src/class/Processor";
import type { ProcessorStep } from "./ProcessorStep";
import type { StepControl } from "./StepControl";

/**
 * État de la simulation
 */
export interface SimulationState {
    codeState: Processor,
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
