import type { ProcessorId } from "@src/interface/CodeInterface";

/**
 * Permets de sauvegarder un code dans localStorage
 * @param id - du processeur
 * @param code - à sauvegarder
 */
export function storeCode(id: ProcessorId, code: string): void {
    localStorage.setItem(`code-${id}`, code);
}

/**
 * Permets de récupérer le code associé à l'id du processeur dans le localStorage
 * @param id - du processeur
 * @returns le code associé au processeur
 */
export function getCode(id: ProcessorId): string | null {
    return localStorage.getItem(`code-${id}`);
}

export function hasCode(id: ProcessorId): boolean {
    return !!getCode(id);
}