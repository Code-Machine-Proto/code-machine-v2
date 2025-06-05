import type { Dispatch, SetStateAction } from "react";

export default function HexSwitcher({ base10, setBase10, name="" }: { base10: boolean, setBase10: Dispatch<SetStateAction<boolean>>, name?: string}) {
    return (
    <button 
        className={
            "py-1 px-3 rounded-md cursor-pointer " 
            + (base10 ? "hover:bg-green-800 bg-green-500" : "hover:bg-main-600 bg-main-400")
        }
        onClick={() => setBase10(previous => !previous)}
        >
            { name }
            { base10 ? "DEC" : "HEX" }
        </button>
    );
}