/**
 * État d'une étape du processeur
 */
export interface ProcessorStep {
    accState?: number,
    pcState: number,
    irState: number,
    stimulatedMemory: number,
    instructionState: number,
    memoryState: Array<number>,
    ma?: number,
    regState?: Array<number>,
    stimulatedLineState: number,
    imState?: Array<number>,
}
