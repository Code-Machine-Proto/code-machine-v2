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
