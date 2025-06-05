import HexNumber from "./HexNumber";

export default function HexNumberLine({ max, jump = 1, className = "", base10 = false, divClassName = ""}: { max: number, jump?: number, className?: string, base10?: boolean, divClassName?: string }) {
    const numbers: Array<number> = [];
    for(let i = 0; i < max; i += jump) {
        numbers.push(i);
    }

    return (
        <>{
        numbers.map((value, index) => <div key={index} className={divClassName}><HexNumber keygen={index} number={value} className={ className } base10={ base10 } /></div>)
        }</>
    );
}