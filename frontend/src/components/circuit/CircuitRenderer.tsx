import { Switch, Match, createSignal } from "solid-js";
import type { Accessor } from "solid-js";
import { ProcessorId } from "@/wasm/types";
import VisualAccumulator from "./VisualAccumulator";
import VisualWithMa from "./VisualWithMa";
import VisualPolyRisc from "./VisualPolyRisc";

interface Props {
  processorId: ProcessorId;
  registers: Accessor<Record<string, number>>;
  stimulatedLineState: Accessor<number>;
  isCompiled: Accessor<boolean>;
}

export default function CircuitRenderer(props: Props) {
  const [zoom, setZoom] = createSignal(1);
  const [pan, setPan] = createSignal({ x: 0, y: 0 });
  let isPanning = false;
  let lastPos = { x: 0, y: 0 };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.3, Math.min(5, z * delta)));
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      isPanning = true;
      lastPos = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    lastPos = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  };

  const handleMouseUp = () => {
    isPanning = false;
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div class="flex flex-col h-full">
      <div class="panel-header">
        <span class="panel-label">Circuit</span>
        <div class="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(z => Math.min(5, z * 1.2))}
            class="btn-control w-6 h-6 text-xs"
            title="Zoom avant"
          >+</button>
          <span class="text-[10px] text-main-600 font-mono tabular-nums w-10 text-center">{Math.round(zoom() * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.max(0.3, z * 0.8))}
            class="btn-control w-6 h-6 text-xs"
            title="Zoom arriere"
          >-</button>
          <button
            onClick={resetView}
            class="btn-control px-1.5 py-0.5 text-[10px]"
            title="Reinitialiser la vue"
          >Reset</button>
        </div>
      </div>
      <div
        class="flex-1 overflow-hidden min-h-0 bg-grid-fine"
        style={{ cursor: isPanning ? "grabbing" : "default" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          class="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${pan().x}px, ${pan().y}px) scale(${zoom()})`,
            "transform-origin": "center center",
          }}
        >
          <Switch fallback={<p class="text-main-600">Selectionnez un processeur</p>}>
            <Match when={props.processorId === ProcessorId.Accumulator}>
              <VisualAccumulator stimulatedLineState={props.stimulatedLineState()} registers={props.registers()} />
            </Match>
            <Match when={props.processorId === ProcessorId.AccumulatorMa}>
              <VisualWithMa stimulatedLineState={props.stimulatedLineState()} registers={props.registers()} />
            </Match>
            <Match when={props.processorId === ProcessorId.PolyRisc}>
              <VisualPolyRisc stimulatedLineState={props.stimulatedLineState()} registers={props.registers()} />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
