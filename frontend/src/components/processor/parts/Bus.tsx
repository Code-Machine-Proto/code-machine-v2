import type { BusProps } from "@src/interface/ProcessorPartsProps";

export default function Bus({ x, y, number }: BusProps) {
    return (
        <svg x={x} y={y} width="19" height="19" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.9476 37.1656L37.3029 1.81031" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <text x={20} dominantBaseline="hanging" textAnchor="end" fill="white">{number}</text>
        </svg>
    );
}