// frontend/src/components/memory/MemoryView.tsx
import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import type { Accessor } from "solid-js";

interface Props {
  memory: Accessor<number[]>;
  stimulatedMemory: Accessor<number>;
  isCompiled: Accessor<boolean>;
}

const COLUMN_OPTIONS = [2, 4, 8, 16];

export default function MemoryView(props: Props) {
  const [displayHex, setDisplayHex] = createSignal(true);
  const [addrHex, setAddrHex] = createSignal(true);
  const [columns, setColumns] = createSignal(4);
  const [wide, setWide] = createSignal(false);

  let containerRef!: HTMLDivElement;

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWide(w > 380);
    });
    observer.observe(containerRef);
    onCleanup(() => observer.disconnect());
  });

  const formatValue = (val: number) => {
    if (displayHex()) {
      const unsigned = val < 0 ? val + 0x10000 : val;
      return "0x" + unsigned.toString(16).toUpperCase().padStart(4, "0");
    }
    return val.toString();
  };

  const formatAddr = (addr: number) => {
    if (addrHex()) return "0x" + addr.toString(16).toUpperCase().padStart(2, "0");
    return addr.toString();
  };

  const rows = () => {
    const mem = props.memory();
    const cols = columns();
    const result = [];
    for (let i = 0; i < mem.length; i += cols) {
      result.push({
        address: i,
        values: mem.slice(i, i + cols),
      });
    }
    return result;
  };

  return (
    <div ref={containerRef} class="flex flex-col h-full">
      {/* Header */}
      <div class="panel-header gap-2">
        <span
          class="panel-label shrink-0"
          classList={{ "text-xs": wide(), "text-[10px]": !wide() }}
        >
          {wide() ? "Memoire" : "Mem."}
        </span>
        <div class="flex items-center gap-1 flex-wrap justify-end">
          <select
            value={columns()}
            onChange={(e) => setColumns(parseInt(e.currentTarget.value))}
            classList={{
              "bg-main-800 text-main-400 rounded-md border border-main-700/50 cursor-pointer transition-colors": true,
              "text-xs px-1.5 py-0.5": wide(),
              "text-[10px] px-1 py-0.5": !wide(),
            }}
          >
            <For each={COLUMN_OPTIONS}>
              {(n) => <option value={n}>{wide() ? `${n} col` : `${n}c`}</option>}
            </For>
          </select>
          <button
            onClick={() => setAddrHex((h) => !h)}
            classList={{
              "text-main-500 hover:text-main-300 rounded-md border border-main-700/50 transition-colors": true,
              "text-xs px-1.5 py-0.5": wide(),
              "text-[10px] px-1 py-0.5": !wide(),
            }}
          >
            {wide() ? (addrHex() ? "Addr: HEX" : "Addr: DEC") : (addrHex() ? "A:H" : "A:D")}
          </button>
          <button
            onClick={() => setDisplayHex((h) => !h)}
            classList={{
              "text-main-500 hover:text-main-300 rounded-md border border-main-700/50 transition-colors": true,
              "text-xs px-1.5 py-0.5": wide(),
              "text-[10px] px-1 py-0.5": !wide(),
            }}
          >
            {wide() ? (displayHex() ? "Val: HEX" : "Val: DEC") : (displayHex() ? "V:H" : "V:D")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div class="flex-1 overflow-auto p-1.5">
        <Show when={props.isCompiled()} fallback={
          <p class="text-main-600 text-xs text-center mt-8">Compilez pour voir la memoire</p>
        }>
          <table class="w-full border-collapse font-mono" classList={{ "text-xs": wide(), "text-[10px]": !wide() }}>
            <thead>
              <tr>
                <th class="text-main-600 text-right pr-1.5 py-0.5 font-normal w-10"></th>
                <For each={Array.from({ length: columns() }, (_, i) => i)}>
                  {(offset) => (
                    <th class="text-main-600 text-center py-0.5 font-normal">+{offset}</th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={rows()}>
                {(row) => (
                  <tr>
                    <td class="text-main-500 text-right pr-1.5 py-0.5 w-10 shrink-0">{formatAddr(row.address)}</td>
                    <For each={row.values}>
                      {(val, idx) => {
                        const addr = row.address + idx();
                        const isStimulated = () => addr === props.stimulatedMemory() && props.stimulatedMemory() >= 0;
                        return (
                          <td class="text-center py-0.5 px-0.5">
                            <div
                              class="rounded px-1 transition-colors"
                              classList={{
                                "bg-main-800 text-main-400": !isStimulated(),
                                "bg-green-700 text-white": isStimulated(),
                                "py-1.5": wide(),
                                "py-1": !wide(),
                              }}
                            >
                              {formatValue(val)}
                            </div>
                          </td>
                        );
                      }}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
      </div>
    </div>
  );
}
