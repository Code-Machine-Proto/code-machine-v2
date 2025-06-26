import type { AluProps } from "@src/interface/props/ProcessorParts";

/**
 * Affiche une ALU dans une svg avec l'activation des signaux de contrôle
 * @prop x - position en x sur le svg parent
 * @prop y - position en y sur le svg parent
 * @prop hasNz - présence du signal nz sur le svg
 * @prop isNzActivated - activation du signal nz
 * @prop isOpActivated - activation du signal op
 * @returns le svg représentant l'ALU
 */
export default function ALU({ x, y, hasNz = false, isActivated = false }: AluProps) {

    return (
        <svg x={x} y={y} width="70" height="170" viewBox="0 0 170 422" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M170 49.0742V330.925L0 380V211.65L75 190L0 168.349V0L170 49.0742Z" fill="#D9D9D9"/>
            <text x={5} y={95} className="font-semibold text-xl" fill="black">A</text>
            <text x={5} y={285} className="font-semibold text-xl" fill="black">B</text>
            <text x={165} y={190} textAnchor="end" className="font-semibold text-xl" fill="black">F</text>
            <text x={165} y={70} textAnchor="end" className="font-bold text-xl" fill="black">ALU</text>
            <path 
                d="M40 368L25.5662 393H54.4338L40 368ZM40 422H42.5L42.5 390.5H40H37.5L37.5 422H40Z" 
                className={ isActivated ? "fill-main-500" : "fill-white" } 
            />
            <text x={50} y={410} fill="white">op_alu</text>
            {
            hasNz &&
            <>
            <path 
                d="M122 398L136.434 373H107.566L122 398ZM122 375.5H124.5L124.5 344H122H119.5L119.5 375.5H122Z" 
                className={ isActivated ? "fill-main-500" : "fill-white" }
            />
            <text x={130} y={400} fill="white">NZ</text>
            </>
            }
        </svg>
    );
}
