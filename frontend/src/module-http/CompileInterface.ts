/**
 * Format des données à envoyer vers le serveur
 */
export interface CompilePayload {
    processorId: number,
    program: Array<string>,
}

/**
 * Format des données revenant du serveur
 */
export interface CompileResult {
    hex: Array<string>,
    output: string,
}
