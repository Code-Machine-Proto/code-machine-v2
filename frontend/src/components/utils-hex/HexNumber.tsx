import { BASE_10, BASE_16 } from "@src/constants/HexUtils";
import type { HexNumberProps } from "@src/interface/props/HexNumber";

/**
 * Nombre qui peut être sous forme hexadécimal ou décimal
 * @prop keygen - clé à ajouter lorsque le nombre est utilisé dans une boucle
 * @prop number - le nombre à afficher
 * @prop isBase10 - si le nombre est en base 10 ou 16
 * @prop className - l'apparence du nombre remonté vers le haut
 * @returns le composant react qui devra s'afficher
 */
export default function HexNumber({ keygen, number, isBase10 = false, className = "" }: HexNumberProps) {
    return (
            <p key={keygen} className={ "text-right " + className }>
                { isBase10 ? "" : "0x" }
                { number.toString(isBase10 ? BASE_10 : BASE_16) }
            </p>
    );
}
