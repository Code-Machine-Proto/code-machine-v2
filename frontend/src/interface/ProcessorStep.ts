export interface ProcessorStep {
    accState?: number,
    pcState: number,
    irState: number,
    stimulatedMemory: number,
    instructionState: number,
    memoryState: Array<number>,
    ma?: number,
    regState?: Array<number>,

}