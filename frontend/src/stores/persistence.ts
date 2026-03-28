// frontend/src/stores/persistence.ts
import { ProcessorId } from "@/wasm/types";

const STORAGE_PREFIX = "codemachine_code_";

export function loadCode(processorId: ProcessorId): string {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${processorId}`) ?? "";
  } catch {
    return "";
  }
}

export function saveCode(processorId: ProcessorId, code: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${processorId}`, code);
  } catch {
    // localStorage unavailable or full — silently fail
  }
}
