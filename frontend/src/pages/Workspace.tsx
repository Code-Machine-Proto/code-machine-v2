// frontend/src/pages/Workspace.tsx
import { useParams, useNavigate } from "@solidjs/router";
import { onMount, onCleanup, Show, createMemo, createSignal, For } from "solid-js";
import { initWasm } from "@/wasm/bridge";
import { processorIdFromRoute, ProcessorId } from "@/wasm/types";
import { createSimulationStore } from "@/stores/simulation";
import CodeEditor from "@/components/editor/CodeEditor";
import Controls from "@/components/execution/Controls";
import CircuitRenderer from "@/components/circuit/CircuitRenderer";
import MemoryView from "@/components/memory/MemoryView";
import ResizablePanel from "@/components/layout/ResizablePanel";
import { useTheme } from "@/stores/theme";
import InstructionDrawer from "@/components/reference/InstructionDrawer";

const processorLabels: Record<number, string> = {
  [ProcessorId.Accumulator]: "Accumulateur",
  [ProcessorId.AccumulatorMa]: "Accumulateur + MA",
  [ProcessorId.PolyRisc]: "PolyRisc",
};

export default function Workspace() {
  const params = useParams();
  const navigate = useNavigate();
  const processorId = createMemo(() => processorIdFromRoute(params.id));

  const { isDark, toggle: toggleTheme } = useTheme();
  const store = createSimulationStore(processorId());
  const [wasmReady, setWasmReady] = createSignal(false);
  const [wasmError, setWasmError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      await initWasm();
      setWasmReady(true);
    } catch (e) {
      console.error("Failed to load WASM:", e);
      setWasmError(String(e));
    }
  });

  // --- Keyboard shortcuts ---
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't capture when typing in editor or inputs
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if ((e.target as HTMLElement)?.closest(".cm-editor")) return;

    if (!store.isCompiled()) return;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        store.stepForward();
        break;
      case "ArrowLeft":
        e.preventDefault();
        store.stepBackward();
        break;
      case " ":
        e.preventDefault();
        store.togglePlay();
        break;
      case "Home":
        e.preventDefault();
        store.goToStart();
        break;
      case "End":
        e.preventDefault();
        store.goToEnd();
        break;
    }
  };

  onMount(() => document.addEventListener("keydown", handleKeyDown));
  onCleanup(() => document.removeEventListener("keydown", handleKeyDown));

  const handleCompile = () => {
    if (!wasmReady()) return;
    store.compileAndRun();
  };

  const stimulatedMemory = createMemo(() => {
    const cycle = store.currentCycle();
    return cycle?.stimulated_memory ?? 0;
  });

  const [regHex, setRegHex] = createSignal(true);
  const [regCollapsed, setRegCollapsed] = createSignal(false);
  const [sidebarWide, setSidebarWide] = createSignal(false);
  const [instructionsOpen, setInstructionsOpen] = createSignal(false);
  let sidebarRef!: HTMLDivElement;

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setSidebarWide(w > 350);
    });
    if (sidebarRef) observer.observe(sidebarRef);
    onCleanup(() => observer.disconnect());
  });

  const registerEntries = createMemo(() => {
    const regs = store.registers();
    return Object.entries(regs).sort(([a], [b]) => {
      const order = ["PC", "IR", "ACC", "MA", "FlagZ", "FlagN"];
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return a.localeCompare(b, undefined, { numeric: true });
    });
  });

  const regColors: Record<string, string> = {
    PC: "border-blue-500 bg-blue-500/10",
    IR: "border-purple-500 bg-purple-500/10",
    ACC: "border-emerald-500 bg-emerald-500/10",
    MA: "border-amber-500 bg-amber-500/10",
    FlagZ: "border-rose-500 bg-rose-500/10",
    FlagN: "border-rose-500 bg-rose-500/10",
  };

  const formatReg = (name: string, value: number) => {
    if (name === "FlagZ" || name === "FlagN") return value.toString();
    if (regHex()) {
      const unsigned = value < 0 ? value + 0x10000 : value;
      return "0x" + (unsigned & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
    }
    return value.toString();
  };

  return (
    <div class="flex flex-col h-screen overflow-hidden bg-main-950">
      {/* Header bar */}
      <div class="h-10 shrink-0 flex items-center px-4 gap-3 border-b border-main-700/40 bg-main-900">
        <button
          onClick={() => navigate("/")}
          class="text-main-600 hover:text-main-300 text-xs flex items-center gap-1 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          Retour
        </button>
        <div class="w-px h-4 bg-main-700/50" />
        <span class="text-main-400 text-sm font-semibold tracking-wide">{processorLabels[processorId()] ?? params.id}</span>

        <Show when={wasmError()}>
          <span class="text-red-400 text-xs ml-auto">Erreur WASM: {wasmError()}</span>
        </Show>
        <Show when={!wasmReady() && !wasmError()}>
          <span class="text-main-600 text-xs ml-auto animate-pulse">Chargement...</span>
        </Show>
        <Show when={wasmReady()}>
          <div class="flex items-center gap-3 ml-auto">
            <span class="text-main-700 text-[10px] hidden sm:inline font-mono">
              Espace=lecture  Fleches=pas  Home/End=debut/fin
            </span>
            <div class="flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500/70" />
              <span class="text-green-500/50 text-[10px] tracking-wide">Pret</span>
            </div>
          </div>
        </Show>
        <button
          onClick={() => setInstructionsOpen(true)}
          class="btn-control h-7 px-2 ml-1 gap-1 text-[10px]"
          title="Jeu d'instructions"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span class="hidden sm:inline">Instructions</span>
        </button>
        <button
          onClick={toggleTheme}
          class="btn-control w-7 h-7"
          title={isDark() ? "Mode clair" : "Mode sombre"}
        >
          <Show when={isDark()} fallback={
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          }>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </Show>
        </button>
      </div>

      {/* Controls bar */}
      <div class="shrink-0 border-b border-main-700/40">
        <Controls
          currentStep={store.currentStep}
          totalSteps={store.totalSteps}
          isPlaying={store.isPlaying}
          isCompiled={store.isCompiled}
          phase={store.phase}
          playbackSpeed={store.playbackSpeed}
          setPlaybackSpeed={store.setPlaybackSpeed}
          onStepForward={store.stepForward}
          onStepBackward={store.stepBackward}
          onGoToStart={store.goToStart}
          onGoToEnd={store.goToEnd}
          onTogglePlay={store.togglePlay}
          setCurrentStep={store.setCurrentStep}
        />
      </div>

      {/* Main content — resizable three-column layout */}
      <div class="flex-1 min-h-0">
        <ResizablePanel
          direction="horizontal"
          initialSizes={[25, 50, 25]}
          minSizes={[200, 300, 200]}
        >
          {/* Left: Code Editor */}
          <CodeEditor
            processorId={processorId()}
            initialCode={store.code()}
            onChange={store.setCode}
            onCompile={handleCompile}
            diagnostics={store.diagnostics()}
          />

          {/* Center: Circuit View */}
          <CircuitRenderer
            processorId={processorId()}
            registers={store.registers}
            stimulatedLineState={store.stimulatedLineState}
            isCompiled={store.isCompiled}
          />

          {/* Right: Registers + Memory */}
          <div ref={sidebarRef} class="flex flex-col h-full overflow-hidden">
            {/* Registers */}
            <div class="shrink-0" classList={{ "border-b border-main-700/40": !regCollapsed() }}>
              <div class="panel-header">
                <button
                  onClick={() => setRegCollapsed(c => !c)}
                  class="panel-label flex items-center gap-1 hover:text-main-300 transition-colors"
                  classList={{ "text-xs": sidebarWide(), "text-[10px]": !sidebarWide() }}
                >
                  <svg
                    class="w-2.5 h-2.5 transition-transform"
                    classList={{ "-rotate-90": regCollapsed() }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                  {sidebarWide() ? "Registres" : "Reg."}
                </button>
                <Show when={store.isCompiled()}>
                  <button
                    onClick={() => setRegHex((h) => !h)}
                    class="text-main-500 hover:text-main-300 px-1.5 py-0.5 rounded-md border border-main-700/50 transition-colors"
                    classList={{ "text-xs": sidebarWide(), "text-[10px]": !sidebarWide() }}
                  >
                    {regHex() ? "HEX" : "DEC"}
                  </button>
                </Show>
              </div>
              <Show when={!regCollapsed()}>
                <div class="max-h-48 overflow-auto" classList={{ "p-3": sidebarWide(), "p-2": !sidebarWide() }}>
                  <Show when={store.isCompiled()} fallback={
                    <p class="text-main-600 text-xs text-center py-2">Compilez pour voir les registres</p>
                  }>
                    <div classList={{ "flex flex-col gap-1.5": sidebarWide(), "flex flex-col gap-1": !sidebarWide() }}>
                      <For each={registerEntries()}>
                        {([name, value]) => {
                          const color = regColors[name] ?? "border-main-600 bg-main-800/50";
                          return (
                            <div class={`flex items-center justify-between rounded border ${color}`}
                              classList={{ "px-3 py-2": sidebarWide(), "px-2 py-1": !sidebarWide() }}
                            >
                              <span class="font-semibold text-main-300"
                                classList={{ "text-sm": sidebarWide(), "text-[10px]": !sidebarWide() }}
                              >{name}</span>
                              <span class="font-mono text-white"
                                classList={{ "text-sm": sidebarWide(), "text-[10px]": !sidebarWide() }}
                              >
                                {typeof value === "number" ? formatReg(name, value) : value}
                              </span>
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>

            {/* Memory */}
            <div class="flex-1 min-h-0 overflow-hidden">
              <MemoryView
                memory={store.memory}
                stimulatedMemory={stimulatedMemory}
                isCompiled={store.isCompiled}
              />
            </div>
          </div>
        </ResizablePanel>
      </div>

      <InstructionDrawer
        processorId={processorId()}
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
    </div>
  );
}
