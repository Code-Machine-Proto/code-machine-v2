import { ProcessorId, type CodeInterface } from "@src/interface/CodeInterface";
import type { ProcessorStep } from "@src/interface/ProcessorStep";

/**
 * Code source par défaut
 */
export const DEFAULT_SOURCE_CODE: CodeInterface = {
    code: "",
    lines: [""],
    processorId: ProcessorId.ACCUMULATOR,
};

export const DEFAULT_ACCUMULATOR_CODE = "";

export const DEFAULT_MA_CODE = "";

export const DEFAULT_POLYRISC_CODE = "";

/**
 * État d'exécution par défaut
 */
export const DEFAULT_EXECUTION_STATE: Array<ProcessorStep> = [{
    pcState: 0,
    irState: 0,
    stimulatedMemory: 0,
    instructionState: 0,
    memoryState: [0],
 }];
