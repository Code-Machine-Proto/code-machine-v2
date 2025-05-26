import type { HexBoxProps } from "@src/interface/HexBoxProps";
import { useState } from "react";

export default function HexBox({ name, number, defaultBase10 = false }: HexBoxProps) {
    const [ base10, setBase10 ] = useState<boolean>(defaultBase10);
    return (
        <div className="flex flex-col size-[9rem] gap-2 bg-inherit p-2 rounded-md">
            <p className="text-4xl">{ name }</p>
            <p className="text-2xl">
                {base10 ? "" : "0x"}
                { number.toString(base10 ? 10 : 16) }
            </p>
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