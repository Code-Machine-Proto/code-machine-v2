import type { HexSwitcherProps } from "@src/interface/props/HexSwitcher";

/**
 * Permets de créer un interrupteur pour passer de hexadécimale à décimale pour un certain nombre
 * @prop isBase10 - état de l'interrupteur
 * @prop setIsBase10 - fonction pour changer l'état de l'interrupteur
 * @returns 
 */
export default function HexSwitcher({ isBase10, setIsBase10, name="" }: HexSwitcherProps) {
    return (
    <button 
        className={
            "py-1 px-3 rounded-md cursor-pointer " 
            + (isBase10 ? "hover:bg-green-800 bg-green-500" : "hover:bg-main-600 bg-main-400")
        }
        onClick={() => setIsBase10(previous => !previous)}
        >
            { name }
            { isBase10 ? "DEC" : "HEX" }
        </button>
    );
}
