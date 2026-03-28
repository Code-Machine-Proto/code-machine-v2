interface AluProps {
  x: number;
  y: number;
  hasNz?: boolean;
  isActivated?: boolean;
}

export default function ALU(props: AluProps) {
  const bodyFill = () => props.isActivated ? "#22c55e18" : "var(--color-main-900)";
  const bodyStroke = () => props.isActivated ? "#22c55e" : "var(--color-main-700)";
  const labelFill = () => props.isActivated ? "#4ade80" : "var(--color-main-500)";
  const arrowClass = () => props.isActivated ? "fill-green-400" : "fill-main-600";

  return (
    <svg x={props.x} y={props.y} width="70" height="170" viewBox="0 0 170 422" fill="none">
      <path
        d="M170 49.0742V330.925L0 380V211.65L75 190L0 168.349V0L170 49.0742Z"
        fill={bodyFill()}
        stroke={bodyStroke()}
        stroke-width="2"
      />
      <text x={12} y={95} class="font-semibold text-xl" fill={labelFill()}>A</text>
      <text x={12} y={285} class="font-semibold text-xl" fill={labelFill()}>B</text>
      <text x={158} y={190} text-anchor="end" class="font-semibold text-xl" fill={labelFill()}>F</text>
      <text x={158} y={70} text-anchor="end" class="font-bold text-xl" fill={labelFill()}>ALU</text>
      <path d="M40 368L25.5662 393H54.4338L40 368ZM40 422H42.5L42.5 390.5H40H37.5L37.5 422H40Z" class={arrowClass()} />
      <text x={50} y={410} class="text-base circuit-label">op_alu</text>
      {props.hasNz && <>
        <path d="M122 398L136.434 373H107.566L122 398ZM122 375.5H124.5L124.5 344H122H119.5L119.5 375.5H122Z" class={arrowClass()} />
        <text x={130} y={400} class="text-base circuit-label">NZ</text>
      </>}
    </svg>
  );
}
