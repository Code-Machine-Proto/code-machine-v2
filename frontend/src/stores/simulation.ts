// frontend/src/stores/simulation.ts
import { createSignal, createEffect, onCleanup, batch } from "solid-js";
import { compileSource, simulateProgram } from "@/wasm/bridge";
import type { CycleState, CompileResult, Diagnostic } from "@/wasm/types";
import { ProcessorId } from "@/wasm/types";
import { loadCode, saveCode } from "./persistence";

export function createSimulationStore(processorId: ProcessorId) {
  const [code, setCode] = createSignal(loadCode(processorId));
  const [steps, setSteps] = createSignal<CycleState[]>([]);
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isCompiled, setIsCompiled] = createSignal(false);
  const [diagnostics, setDiagnostics] = createSignal<Diagnostic[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = createSignal(500);

  // Derived signals
  const currentCycle = () => steps()[currentStep()] ?? null;
  const activeSignals = () => currentCycle()?.active_signals ?? [];
  const registers = () => currentCycle()?.registers ?? {};
  const memory = () => currentCycle()?.memory ?? [];
  const totalSteps = () => steps().length;
  const phase = () => currentCycle()?.phase ?? "Fetch";
  const stimulatedLineState = () => currentCycle()?.stimulated_line_state ?? -1;

  // Debounced persistence
  let saveTimeout: ReturnType<typeof setTimeout>;
  createEffect(() => {
    const c = code();
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveCode(processorId, c), 300);
  });

  // Auto-play
  createEffect(() => {
    if (!isPlaying()) return;
    const id = setInterval(() => {
      setCurrentStep((s) => {
        if (s < steps().length - 1) return s + 1;
        setIsPlaying(false);
        return s;
      });
    }, playbackSpeed());
    onCleanup(() => clearInterval(id));
  });

  function compileAndRun() {
    const result: CompileResult = compileSource(code(), processorId);
    setDiagnostics(result.diagnostics);

    if (!result.success) {
      setIsCompiled(false);
      setSteps([]);
      return;
    }

    const trace = simulateProgram(result.program, processorId);
    batch(() => {
      setSteps(trace.steps);
      setCurrentStep(0);
      setIsCompiled(true);
      setIsPlaying(false);
    });
  }

  function stepForward() {
    setCurrentStep((s) => Math.min(s + 1, steps().length - 1));
  }

  function stepBackward() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  function goToStart() {
    setCurrentStep(0);
  }

  function goToEnd() {
    setCurrentStep(steps().length - 1);
  }

  function togglePlay() {
    setIsPlaying((p) => !p);
  }

  return {
    code, setCode,
    steps, currentStep, setCurrentStep,
    isPlaying, isCompiled,
    diagnostics,
    playbackSpeed, setPlaybackSpeed,
    currentCycle, activeSignals, registers, memory,
    totalSteps, phase, stimulatedLineState,
    compileAndRun,
    stepForward, stepBackward,
    goToStart, goToEnd,
    togglePlay,
  };
}
