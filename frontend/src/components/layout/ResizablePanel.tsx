import { createSignal, JSX } from "solid-js";

interface Props {
  direction: "horizontal" | "vertical";
  initialSizes: number[];
  minSizes?: number[];
  children: JSX.Element[];
}

export default function ResizablePanel(props: Props) {
  const [sizes, setSizes] = createSignal(props.initialSizes);
  let containerRef!: HTMLDivElement;

  const minSizes = () => props.minSizes ?? props.initialSizes.map(() => 50);

  const startResize = (index: number, e: MouseEvent) => {
    e.preventDefault();
    const isHorizontal = props.direction === "horizontal";
    const startPos = isHorizontal ? e.clientX : e.clientY;
    const startSizes = [...sizes()];
    const containerRect = containerRef.getBoundingClientRect();
    const totalSize = isHorizontal ? containerRect.width : containerRect.height;

    const onMove = (e: MouseEvent) => {
      const currentPos = isHorizontal ? e.clientX : e.clientY;
      const delta = currentPos - startPos;
      const deltaPercent = (delta / totalSize) * 100;

      const newSizes = [...startSizes];
      const newLeft = startSizes[index] + deltaPercent;
      const newRight = startSizes[index + 1] - deltaPercent;

      const mins = minSizes();
      const minLeft = (mins[index] / totalSize) * 100;
      const minRight = (mins[index + 1] / totalSize) * 100;

      if (newLeft >= minLeft && newRight >= minRight) {
        newSizes[index] = newLeft;
        newSizes[index + 1] = newRight;
        setSizes(newSizes);
      }
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const isHorizontal = () => props.direction === "horizontal";

  return (
    <div
      ref={containerRef}
      class="flex h-full w-full"
      style={{ "flex-direction": isHorizontal() ? "row" : "column" }}
    >
      {props.children.map((child, i) => (
        <>
          <div
            style={{
              [isHorizontal() ? "width" : "height"]: `${sizes()[i]}%`,
              "min-width": isHorizontal() ? `${minSizes()[i]}px` : undefined,
              "min-height": !isHorizontal() ? `${minSizes()[i]}px` : undefined,
              overflow: "hidden",
            }}
            class="flex flex-col"
          >
            {child}
          </div>
          {i < props.children.length - 1 && (
            <div
              class={`shrink-0 relative group ${
                isHorizontal() ? "w-0" : "h-0"
              }`}
            >
              {/* Visible line */}
              <div
                class={`absolute transition-all duration-150 ${
                  isHorizontal()
                    ? "w-px h-full left-0 top-0 bg-main-700/60 group-hover:bg-accent/60 group-hover:w-0.5"
                    : "h-px w-full top-0 left-0 bg-main-700/60 group-hover:bg-accent/60 group-hover:h-0.5"
                }`}
              />
              {/* Wider invisible hit area */}
              <div
                class={`absolute ${
                  isHorizontal()
                    ? "w-3 h-full -left-1.5 top-0 cursor-col-resize"
                    : "h-3 w-full -top-1.5 left-0 cursor-row-resize"
                }`}
                onMouseDown={(e) => startResize(i, e)}
                onWheel={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      ))}
    </div>
  );
}
