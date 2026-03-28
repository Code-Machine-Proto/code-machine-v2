export default function Bus(props: { x: number; y: number; number: number }) {
  return (
    <svg x={props.x} y={props.y} width="19" height="19" viewBox="0 0 39 39" fill="none">
      <path d="M1.9476 37.1656L37.3029 1.81031" class="circuit-bus" stroke-width="2" stroke-linecap="round"/>
      <text x={20} dominant-baseline="hanging" text-anchor="end" class="circuit-bus" font-size="14" font-weight="600">{props.number}</text>
    </svg>
  );
}
