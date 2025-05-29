export default function HexNumber({ keygen, number, base10 = false, className = "" }: { number: number, base10?: boolean, className?: string, keygen?: number }) {
    return (
            <p key={keygen} className={ "text-right " + className }>
                { base10 ? "" : "0x" }
                { number.toString(base10 ? 10 : 16) }
            </p>
    );
}