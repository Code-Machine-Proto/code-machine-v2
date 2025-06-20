import type Processor from "@src/class/Processor";
import { ProcessorId } from "@src/interface/CodeInterface";
import type { ProcessorStep } from "@src/interface/ProcessorStep";

/**
 * Code source par défaut
 */
export const DEFAULT_SOURCE_CODE = {
    code: "",
    lines: [""],
    processorId: ProcessorId.ACCUMULATOR,
} as Processor;

export const DEFAULT_ACCUMULATOR_CODE = "";

export const DEFAULT_MA_CODE = "";

export const DEFAULT_POLYRISC_CODE = "";

export function getProcessorCode(id: ProcessorId): string {
    switch (id) {
        case ProcessorId.ACCUMULATOR: return DEFAULT_ACCUMULATOR_CODE;
        case ProcessorId.MA_ACCUMULATOR: return DEFAULT_MA_CODE;
        case ProcessorId.RISC: return DEFAULT_POLYRISC_CODE;
    }
}


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
