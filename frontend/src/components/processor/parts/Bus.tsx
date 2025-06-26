import type { BusProps } from "@src/interface/props/ProcessorParts";

/**
 * Affiche une ligne et un nombre pour représenter la taille du bus. 
 * Il faut le placer au dessus d'un fil dans un processeur
 * @prop x - Position en x du svg
 * @prop y - Position en y du svg
 * @prop number - Taille du bus
 * @returns le svg représentant la taille du bus
 */
export default function Bus({ x, y, number }: BusProps) {
    return (
        <svg x={x} y={y} width="19" height="19" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.9476 37.1656L37.3029 1.81031" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <text x={20} dominantBaseline="hanging" textAnchor="end" fill="white">{number}</text>
        </svg>
    );
}
