import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useTheme } from "@/stores/theme";

const processors = [
  {
    id: "accumulator",
    name: "Accumulateur",
    description: "Processeur simple — 9 instructions, registre accumulateur unique",
    icon: "ACC",
    color: "blue",
    accent: "#3b82f6",
  },
  {
    id: "accumulator-ma",
    name: "Accumulateur + MA",
    description: "Etendu — 20 instructions, adressage indirect via le registre MA",
    icon: "MA",
    color: "amber",
    accent: "#f59e0b",
  },
  {
    id: "polyrisc",
    name: "PolyRisc",
    description: "Processeur RISC — 32 registres, drapeaux, jeu d'instructions riche",
    icon: "RISC",
    color: "emerald",
    accent: "#10b981",
  },
];

const colorMap: Record<string, { border: string; iconBg: string; hoverBg: string }> = {
  blue: {
    border: "border-blue-500/30 hover:border-blue-400/60",
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    hoverBg: "hover:bg-blue-500/5",
  },
  amber: {
    border: "border-amber-500/30 hover:border-amber-400/60",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    hoverBg: "hover:bg-amber-500/5",
  },
  emerald: {
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    hoverBg: "hover:bg-emerald-500/5",
  },
};

export default function Home() {
  const { isDark, toggle: toggleTheme } = useTheme();

  return (
    <div class="relative flex flex-col items-center justify-center h-screen px-4 overflow-hidden">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        class="absolute top-4 right-4 z-20 btn-control w-8 h-8"
        title={isDark() ? "Mode clair" : "Mode sombre"}
      >
        <Show when={isDark()} fallback={
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        }>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </Show>
      </button>

      {/* Background grid */}
      <div class="absolute inset-0 bg-grid opacity-40" />
      {/* Radial gradient overlay */}
      <div
        class="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
        }}
      />

      <div class="relative z-10 flex flex-col items-center gap-12">
        {/* Header */}
        <div class="text-center animate-fade-up">
          <h1
            class="text-5xl font-bold tracking-tight text-main-300 mb-3"
            style={{ "font-variant-ligatures": "discretionary-ligatures" }}
          >
            Code<span class="text-accent">Machine</span>
          </h1>
          <p class="text-main-600 text-sm tracking-wide">
            Simulateur de chemin de donnees — INF1600
          </p>
        </div>

        {/* Processor cards */}
        <div class="flex gap-5 flex-wrap justify-center">
          {processors.map((p, i) => {
            const c = colorMap[p.color];
            return (
              <A
                href={`/processor/${p.id}`}
                class={`group relative bg-main-900/80 backdrop-blur-sm border rounded-xl p-6 w-72 transition-all duration-200 cursor-pointer animate-fade-up glow-accent ${c.border} ${c.hoverBg}`}
                style={{ "animation-delay": `${(i + 1) * 100}ms` }}
              >
                {/* Top accent line */}
                <div
                  class="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
                />

                <div class="flex items-center gap-3 mb-3">
                  <div class={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-bold font-mono ${c.iconBg}`}>
                    {p.icon}
                  </div>
                  <h2 class="text-base font-semibold text-main-300 group-hover:text-white transition-colors">
                    {p.name}
                  </h2>
                </div>
                <p class="text-main-500 text-xs leading-relaxed">{p.description}</p>

                {/* Arrow indicator */}
                <div class="mt-4 flex items-center gap-1.5 text-main-600 group-hover:text-main-400 transition-colors text-xs">
                  <span>Ouvrir</span>
                  <svg class="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </A>
            );
          })}
        </div>

        {/* Footer */}
        <p class="text-main-700 text-xs tracking-wider animate-fade-up" style={{ "animation-delay": "500ms" }}>
          Polytechnique Montreal
        </p>
      </div>
    </div>
  );
}
