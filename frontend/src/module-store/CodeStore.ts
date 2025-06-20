import type { ProcessorId } from "@src/interface/CodeInterface";

export function storeCode(id: ProcessorId, code: string): void {
    localStorage.setItem(`code-${id}`, code);
}

export function getCode(id: ProcessorId): string | null {
    return localStorage.getItem(`code-${id}`);
}