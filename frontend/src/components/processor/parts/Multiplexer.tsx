import type { MultiplexerProps } from "@src/interface/props/ProcessorParts";

/**
 * Affiche un multiplexeur avec un signal de contrôle à nom variable
 * @prop x - la position en x du svg
 * @prop y - la position en y du svg
 * @prop isActivated - si le signal de contrôle est activé
 * @prop name - le nom associé au signal de contrôle
 * @returns le svg a affiché
 */
export default function Multiplexer({ x, y, isActivated = false, name }: MultiplexerProps) {
    return (
    <svg x={x} y={y} width="40" height="100" viewBox="0 0 120 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L120 69.2812V220.718L0 290V0Z" fill="#D9D9D9"/>
        <path d="M60 253L45.5662 278H74.4338L60 253ZM60 328H62.5V275.5H60H57.5V328H60Z" className={ isActivated ? "fill-main-500" : "fill-white" } />
        <text textAnchor="middle" x={60} y={345} className="fill-white text-xl" >{ name }</text>
    </svg>
    );
}
