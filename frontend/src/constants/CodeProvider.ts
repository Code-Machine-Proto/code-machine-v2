import type Processor from "@src/class/Processor";
import { ProcessorId } from "@src/interface/CodeInterface";
import type { ProcessorStep } from "@src/interface/ProcessorStep";

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

 export const DEFAULT_SOURCE_CODE = {
    code: "",
    lines: [""],
    processorId: ProcessorId.ACCUMULATOR,
 } as Processor;
