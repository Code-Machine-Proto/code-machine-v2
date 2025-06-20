import type { HexBoxProps } from "@src/interface/props/HexBox";
import { useState } from "react";
import HexNumber from "./HexNumber";
import HexSwitcher from "./HexSwitcher";

/**
 * Permets de créer une boîte qui affichera un nombre et pourra le transformer en hexadécimal au besoin
 * Toujours l'entouré d'un div avec un bg-[<couleur>] size-min et rounded-md pour avoir le visuel voulu
 * @prop name - Le nom a affiché comme nom
 * @prop number - Le nombre a affiché dans la boîte
 * @prop defaultIsBase10 - Si la case est par défaut en base 10. Valeur par défaut false
 * @returns Le composant React a affiché
 */
export default function HexBox({ name, number, defaultIsBase10 = false }: HexBoxProps) {
    const [ isBase10, setIsBase10 ] = useState<boolean>(defaultIsBase10);
    return (
        <div className="flex flex-col size-[9rem] gap-2 bg-inherit p-2 rounded-md">
            <p className="text-4xl">{ name }</p>
            <HexNumber className="text-2xl" isBase10={isBase10} number={number} />
            <HexSwitcher isBase10={isBase10} setIsBase10={setIsBase10} />
        </div>
    );
}
