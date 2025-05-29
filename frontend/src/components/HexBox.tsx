import type { HexBoxProps } from "@src/interface/HexBoxProps";
import { useState } from "react";
import HexNumber from "./HexNumber";

/**
 * Permets de créer une boîte qui affichera un nombre et pourra le transformer en hexadécimal au besoin
 * Toujours l'entouré d'un div avec un bg-[<couleur>] size-min et rounded-md pour avoir le visuel voulu
 * @param name - Le nom a affiché comme nom
 * @param number - Le nombre a affiché dans la boîte
 * @param defaultBase10 - Si la case est par défaut en base 10. Valeur par défaut false
 * @returns Le composant React a affiché
 */
export default function HexBox({ name, number, defaultBase10 = false }: HexBoxProps) {
    const [ base10, setBase10 ] = useState<boolean>(defaultBase10);
    return (
        <div className="flex flex-col size-[9rem] gap-2 bg-inherit p-2 rounded-md">
            <p className="text-4xl">{ name }</p>
            <HexNumber className="text-2xl" base10={base10} number={number} />
            <button 
            className={
                "p-1 rounded-md cursor-pointer " 
                + (base10 ? "hover:bg-green-800 bg-green-500" : "hover:bg-main-600 bg-main-400")
            }
            onClick={() => setBase10(previous => !previous)}
            >
                { base10 ? "DEC" : "HEX" }
            </button>
        </div>
    );
}