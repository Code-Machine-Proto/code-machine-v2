import HexNumber from "@src/components/utils-hex/HexNumber";
import HexSwitcher from "@src/components/utils-hex/HexSwitcher";
import type { RegisterBoxProps } from "@src/interface/props/ProcessorParts";
import { useState } from "react";

/**
 * Composant react englobé d'un foreignObject pour être placé dans une balise svg 
 * Représente un registre pouvant être mis en décimal ou en hexadécimal
 * @prop name - le nom du registre
 * @prop number - le nombre à affiché dans le registre
 * @prop className - le style css du registre
 * @prop x - la position en x du composant
 * @prop y - la position en y du composant
 * @prop defaultIsBase10 - si la boîte commence en base 10 ou 16
 * @returns le composant react englobé d'un svg
 */
export default function RegisterBox({name, number, className, x, y, defaultIsBase10 = false}: RegisterBoxProps) {
    const [isBase10, setIsBase10] = useState<boolean>(defaultIsBase10);

    return(
        <foreignObject x={x} y={y} width={120} height={65}>
            <div className={ `flex flex-col rounded-sm ${className}` } >
                <div className="flex px-2 pt-1 justify-between">
                    <p>{ name }</p>
                    <HexSwitcher isBase10={isBase10} setIsBase10={setIsBase10} />
                </div>
                <div className="flex justify-between">
                    <p className="text-xl">{ ">" }</p>
                    <HexNumber number={number} className="px-2" isBase10={isBase10} />
                </div>
            </div>
        </foreignObject>
    );
}
