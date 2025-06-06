import type { Dispatch, SetStateAction } from "react";

export default function HexSwitcher({ isBase10, setIsBase10, name="" }: { isBase10: boolean, setIsBase10: Dispatch<SetStateAction<boolean>>, name?: string}) {
    return (
    <button 
        className={
            "py-1 px-3 rounded-md cursor-pointer " 
            + (isBase10 ? "hover:bg-green-800 bg-green-500" : "hover:bg-main-600 bg-main-400")
        }
        onClick={() => setIsBase10(previous => !previous)}
        >
            { name }
            { isBase10 ? "DEC" : "HEX" }
        </button>
    );
}