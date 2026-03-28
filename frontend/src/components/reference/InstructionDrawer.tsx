// frontend/src/components/reference/InstructionDrawer.tsx
import { Show, For, createMemo } from "solid-js";
import type { Accessor } from "solid-js";
import { ProcessorId } from "@/wasm/types";

interface Instruction {
  mnemonic: string;
  operands: string;
  description: string;
  category: string;
}

const accumulatorInstructions: Instruction[] = [
  { mnemonic: "add", operands: "ADR", description: "ACC ← ACC + Mem[ADR]", category: "ALU" },
  { mnemonic: "sub", operands: "ADR", description: "ACC ← ACC - Mem[ADR]", category: "ALU" },
  { mnemonic: "mul", operands: "ADR", description: "ACC ← ACC × Mem[ADR]", category: "ALU" },
  { mnemonic: "ld", operands: "ADR", description: "ACC ← Mem[ADR]", category: "Memoire" },
  { mnemonic: "st", operands: "ADR", description: "Mem[ADR] ← ACC", category: "Memoire" },
  { mnemonic: "br", operands: "ADR", description: "PC ← ADR", category: "Branchement" },
  { mnemonic: "brz", operands: "ADR", description: "Si ACC = 0 → PC ← ADR", category: "Branchement" },
  { mnemonic: "brnz", operands: "ADR", description: "Si ACC ≠ 0 → PC ← ADR", category: "Branchement" },
  { mnemonic: "stop", operands: "—", description: "Arret du programme", category: "Controle" },
  { mnemonic: "nop", operands: "—", description: "Aucune operation", category: "Controle" },
];

const accumulatorMaInstructions: Instruction[] = [
  { mnemonic: "add", operands: "ADR", description: "ACC ← ACC + Mem[ADR]", category: "ALU" },
  { mnemonic: "sub", operands: "ADR", description: "ACC ← ACC - Mem[ADR]", category: "ALU" },
  { mnemonic: "mul", operands: "ADR", description: "ACC ← ACC × Mem[ADR]", category: "ALU" },
  { mnemonic: "adda", operands: "ADR", description: "MA ← MA + Mem[ADR]", category: "ALU" },
  { mnemonic: "suba", operands: "ADR", description: "MA ← MA - Mem[ADR]", category: "ALU" },
  { mnemonic: "addx", operands: "—", description: "ACC ← ACC + Mem[MA]", category: "ALU" },
  { mnemonic: "subx", operands: "—", description: "ACC ← ACC - Mem[MA]", category: "ALU" },
  { mnemonic: "shl", operands: "—", description: "ACC ← ACC << 1", category: "ALU" },
  { mnemonic: "shr", operands: "—", description: "ACC ← ACC >> 1", category: "ALU" },
  { mnemonic: "ld", operands: "ADR", description: "ACC ← Mem[ADR]", category: "Memoire" },
  { mnemonic: "st", operands: "ADR", description: "Mem[ADR] ← ACC", category: "Memoire" },
  { mnemonic: "lda", operands: "ADR", description: "MA ← Mem[ADR]", category: "Memoire" },
  { mnemonic: "sta", operands: "ADR", description: "Mem[ADR] ← MA", category: "Memoire" },
  { mnemonic: "ldi", operands: "—", description: "ACC ← Mem[MA]", category: "Memoire" },
  { mnemonic: "sti", operands: "—", description: "Mem[MA] ← ACC", category: "Memoire" },
  { mnemonic: "lea", operands: "ADR", description: "MA ← ADR", category: "Memoire" },
  { mnemonic: "br", operands: "ADR", description: "PC ← ADR", category: "Branchement" },
  { mnemonic: "brz", operands: "ADR", description: "Si ACC = 0 → PC ← ADR", category: "Branchement" },
  { mnemonic: "brnz", operands: "ADR", description: "Si ACC ≠ 0 → PC ← ADR", category: "Branchement" },
  { mnemonic: "stop", operands: "—", description: "Arret du programme", category: "Controle" },
  { mnemonic: "nop", operands: "—", description: "Aucune operation", category: "Controle" },
];

const polyriscInstructions: Instruction[] = [
  { mnemonic: "add", operands: "rd, rs1, rs2", description: "rd ← rs1 + rs2", category: "ALU" },
  { mnemonic: "sub", operands: "rd, rs1, rs2", description: "rd ← rs1 - rs2", category: "ALU" },
  { mnemonic: "and", operands: "rd, rs1, rs2", description: "rd ← rs1 & rs2", category: "ALU" },
  { mnemonic: "or", operands: "rd, rs1, rs2", description: "rd ← rs1 | rs2", category: "ALU" },
  { mnemonic: "not", operands: "rd, rs1", description: "rd ← ~rs1", category: "ALU" },
  { mnemonic: "shl", operands: "rd, rs1", description: "rd ← rs1 << 1", category: "ALU" },
  { mnemonic: "shr", operands: "rd, rs1", description: "rd ← rs1 >> 1", category: "ALU" },
  { mnemonic: "mv", operands: "rd, rs1", description: "rd ← rs1", category: "ALU" },
  { mnemonic: "ld", operands: "rd, (rs1)", description: "rd ← Mem[rs1]", category: "Memoire" },
  { mnemonic: "st", operands: "(rs1), rs2", description: "Mem[rs1] ← rs2", category: "Memoire" },
  { mnemonic: "ldi", operands: "rd, imm", description: "rd ← imm (immediat 16 bits)", category: "Memoire" },
  { mnemonic: "br", operands: "cible", description: "PC ← cible", category: "Branchement" },
  { mnemonic: "brz", operands: "cible", description: "Si Z = 1 → PC ← cible", category: "Branchement" },
  { mnemonic: "brnz", operands: "cible", description: "Si Z = 0 → PC ← cible", category: "Branchement" },
  { mnemonic: "brlz", operands: "cible", description: "Si N = 1 → PC ← cible", category: "Branchement" },
  { mnemonic: "brgez", operands: "cible", description: "Si N = 0 → PC ← cible", category: "Branchement" },
  { mnemonic: "stop", operands: "—", description: "Arret du programme", category: "Controle" },
];

const instructionSets: Record<number, Instruction[]> = {
  [ProcessorId.Accumulator]: accumulatorInstructions,
  [ProcessorId.AccumulatorMa]: accumulatorMaInstructions,
  [ProcessorId.PolyRisc]: polyriscInstructions,
};

const categoryColors: Record<string, string> = {
  ALU: "text-green-400 bg-green-500/10 border-green-500/20",
  Memoire: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Branchement: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Controle: "text-main-500 bg-main-500/10 border-main-500/20",
};

interface Props {
  processorId: ProcessorId;
  open: Accessor<boolean>;
  onClose: () => void;
}

export default function InstructionDrawer(props: Props) {
  const instructions = createMemo(() => instructionSets[props.processorId] ?? []);

  const grouped = createMemo(() => {
    const groups: Record<string, Instruction[]> = {};
    for (const instr of instructions()) {
      (groups[instr.category] ??= []).push(instr);
    }
    return Object.entries(groups);
  });

  return (
    <div
      class="fixed inset-0 z-50 transition-opacity duration-200"
      classList={{
        "pointer-events-none opacity-0": !props.open(),
        "pointer-events-auto opacity-100": props.open(),
      }}
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/30" onClick={props.onClose} />

      {/* Drawer panel */}
      <div
        class="absolute top-0 right-0 h-full w-[380px] max-w-[90vw] bg-main-950 border-l border-main-700/50 flex flex-col shadow-2xl transition-transform duration-200"
        classList={{
          "translate-x-full": !props.open(),
          "translate-x-0": props.open(),
        }}
      >
        {/* Header */}
        <div class="panel-header py-3">
          <span class="panel-label text-xs">Jeu d'instructions</span>
          <button
            onClick={props.onClose}
            class="btn-control w-6 h-6 text-xs"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div class="flex-1 overflow-auto p-3 space-y-4">
          <For each={grouped()}>
            {([category, instrs]) => (
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryColors[category] ?? ""}`}
                  >
                    {category}
                  </span>
                  <div class="flex-1 h-px bg-main-800" />
                </div>
                <div class="space-y-1">
                  <For each={instrs}>
                    {(instr) => (
                      <div class="flex items-baseline gap-3 px-2 py-1.5 rounded-md hover:bg-main-900 transition-colors group">
                        <code class="text-accent font-mono font-semibold text-sm w-12 shrink-0">
                          {instr.mnemonic}
                        </code>
                        <span class="text-main-500 font-mono text-xs w-24 shrink-0">
                          {instr.operands}
                        </span>
                        <span class="text-main-400 text-xs">
                          {instr.description}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Footer hint */}
        <div class="shrink-0 px-3 py-2 border-t border-main-700/50">
          <p class="text-main-600 text-[10px] text-center">
            {instructions().length} instructions disponibles
          </p>
        </div>
      </div>
    </div>
  );
}
