export interface CompilePayload {
    processorId: number,
    program: Array<string>,
}

export interface CompileResult {
    hex: Array<string>,
    output: string,
}