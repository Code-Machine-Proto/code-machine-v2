import HexNumber from "./HexNumber";

export default function HexNumberLine({ max, jump = 1, className = "", isBase10 = false, divClassName = ""}: { max: number, jump?: number, className?: string, isBase10?: boolean, divClassName?: string }) {
    const numbers: Array<number> = [];
    for(let i = 0; i < max; i += jump) {
        numbers.push(i);
    }

    return (
        <>{
        numbers.map((value, index) => <div key={index} className={divClassName}><HexNumber keygen={index} number={value} className={ className } isBase10={ isBase10 } /></div>)
        }</>
    );
}