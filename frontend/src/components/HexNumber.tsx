export default function HexNumber({ number , base10 = false, className = "" }: { number: number, base10?: boolean, className?: string }) {
    return (
            <p className={ "text-right " + className }>
                { base10 ? "" : "0x" }
                { number.toString(base10 ? 10 : 16) }
            </p>
    );
}