import type { HexNumberLineProps } from "@src/interface/props/HexNumberLine";
import HexNumber from "./HexNumber";

/**
 * Permets de générer une ligne de nombre avec un intervalle régulier ainsi qu'un maximum défini
 * @prop max - le nombre maximale(exclut) pouvant être atteint
 * @prop jump - le bond entre les nombres de la ligne
 * @prop classname - le style des nombres
 * @prop isBase10 - si les nombres sont en base 10
 * @prop divClassName - le style du div englobant chacun des nombres
 * @returns le composant react a affiché
 */
export default function HexNumberLine({ max, jump = 1, className = "", isBase10 = false, divClassName = ""}: HexNumberLineProps) {
    const numbers: Array<number> = [];
    for(let i = 0; i < max; i += jump) {
        numbers.push(i);
    }

    return (
        <>{
        numbers.map((value, index) => 
        <div key={index} className={divClassName}>
            <HexNumber keygen={index} number={value} className={ className } isBase10={ isBase10 } />
        </div>
        )
        }</>
    );
}
