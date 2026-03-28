// frontend/src/wasm/bridge.ts
import type { CompileResult, SimulationTrace } from "./types";
import init, { compile, simulate } from "codemachine-simulator";

let initialized = false;

export async function initWasm(): Promise<void> {
  if (initialized) return;
  await init();
  initialized = true;
}

export function compileSource(source: string, processorId: number): CompileResult {
  if (!initialized) throw new Error("WASM not initialized");
  return compile(source, processorId) as CompileResult;
}

function mapToObject(val: unknown): Record<string, number> {
  if (val instanceof Map) {
    const obj: Record<string, number> = {};
    (val as Map<string, number>).forEach((v, k) => { obj[k] = v; });
    return obj;
  }
  return (val as Record<string, number>) ?? {};
}

export function simulateProgram(program: Uint32Array | number[], processorId: number): SimulationTrace {
  if (!initialized) throw new Error("WASM not initialized");
  const arr = program instanceof Uint32Array ? program : new Uint32Array(program);
  const trace = simulate(arr, processorId) as SimulationTrace;
  // serde_wasm_bindgen may serialize HashMap as JS Map — normalize to plain objects
  for (const step of trace.steps) {
    step.registers = mapToObject(step.registers);
  }
  return trace;
}
