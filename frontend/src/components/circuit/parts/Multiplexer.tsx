export default function Multiplexer(props: { x: number; y: number; isActivated?: boolean; name: string }) {
  const bodyFill = () => props.isActivated ? "#3b82f618" : "var(--color-main-900)";
  const bodyStroke = () => props.isActivated ? "#3b82f6" : "var(--color-main-700)";
  const arrowClass = () => props.isActivated ? "fill-blue-400" : "fill-main-600";

  return (
    <svg x={props.x} y={props.y} width="40" height="100" viewBox="0 0 120 360" fill="none">
      <path
        d="M0 0L120 69.2812V220.718L0 290V0Z"
        fill={bodyFill()}
        stroke={bodyStroke()}
        stroke-width="2"
      />
      <path d="M60 253L45.5662 278H74.4338L60 253ZM60 328H62.5V275.5H60H57.5V328H60Z" class={arrowClass()} />
      <text text-anchor="middle" x={60} y={345} class="text-xl circuit-label">{props.name}</text>
    </svg>
  );
}
