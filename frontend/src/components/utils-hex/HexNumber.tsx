import { BASE_10, BASE_16 } from "@src/constants/HexUtils";

export default function HexNumber({ keygen, number, isBase10 = false, className = "" }: { number: number, isBase10?: boolean, className?: string, keygen?: number }) {
    return (
            <p key={keygen} className={ "text-right " + className }>
                { isBase10 ? "" : "0x" }
                { number.toString(isBase10 ? BASE_10 : BASE_16) }
            </p>
    );
}