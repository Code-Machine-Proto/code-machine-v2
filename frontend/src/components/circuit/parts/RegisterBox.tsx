import { createSignal } from "solid-js";

interface Props {
  name: string;
  number: number;
  class: string;
  x: number;
  y: number;
  defaultIsBase10?: boolean;
  isActivated: boolean;
  registerSize?: number;
}

const REGISTER_8_BIT = 2;
const REGISTER_12_BIT = 3;
const REGISTER_16_BIT = 4;
const REGISTER_28_BIT = 7;

function formatHex(num: number, size: number): string {
  const val = num < 0 ? num + Math.pow(16, size) : num;
  return "0x" + val.toString(16).toUpperCase().padStart(size, "0");
}

export default function RegisterBox(props: Props) {
  const [isBase10, setIsBase10] = createSignal(props.defaultIsBase10 ?? false);
  const size = () => props.registerSize ?? REGISTER_16_BIT;

  const displayValue = () => {
    if (isBase10()) return props.number.toString();
    return formatHex(props.number, size());
  };

  return (
    <svg x={props.x} y={props.y} width="120" height="96" viewBox="0 0 120 96" fill="none">
      <foreignObject width={120} height={65}>
        <div class={`flex flex-col rounded-sm text-sm ${props.class}`} style="font-family: monospace;">
          <div class="flex px-2 pt-1 justify-between items-center">
            <span class="font-semibold">{props.name}</span>
            <button
              class="text-xs opacity-70 hover:opacity-100 cursor-pointer"
              onClick={() => setIsBase10(b => !b)}
            >
              {isBase10() ? "DEC" : "HEX"}
            </button>
          </div>
          <div class="flex justify-between items-center px-1">
            <span>{">"}</span>
            <span class="px-2 text-base">{displayValue()}</span>
          </div>
        </div>
      </foreignObject>
      <path
        d="M59 86C59 86.5523 59.4477 87 60 87C60.5523 87 61 86.5523 61 86H59ZM60 65L54.2265 75H65.7735L60 65ZM60 86H61V74H60H59V86H60Z"
        class={props.isActivated ? "fill-main-500" : "fill-main-300"}
      />
      <text x={65} y={85} class="fill-main-300 text-xs">{"wr_" + props.name.toLowerCase()}</text>
    </svg>
  );
}

export { REGISTER_8_BIT, REGISTER_12_BIT, REGISTER_16_BIT, REGISTER_28_BIT };
