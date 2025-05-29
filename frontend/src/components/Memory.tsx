import { COLUMN_CHOICE } from "@src/constants/Memory";
import { useState } from "react";
import HexNumber from "./HexNumber";
import HexNumberLine from "./HexNumberLine";

export default function Memory({ memoryContent }: { memoryContent: Array<number>}) {
    const [columnCount, setColumnCount] = useState<number>(4);

    return (
        <div className="flex flex-col gap-1">
            
            <div className="flex">
                <div className="flex flex-col text-white bg-slate-800 p-3 rounded-md">
                    <p className="text-xs text-main-400">Mode</p>
                    <select value={columnCount} className="bg-slate-800 outline-none" onChange={(event) => setColumnCount(parseInt(event.target.value))}>
                        {
                            COLUMN_CHOICE.map((value, index) => <option key={index}>{value.count}</option>)
                        }
                    </select>
                </div>
            </div>

            <div className="flex gap-1">
                <div className="flex flex-col size-[4rem] bg-green-400 justify-center p-2 rounded-sm"></div>
                <HexNumberLine max={columnCount} divClassName="flex flex-col size-[4rem] bg-green-400 justify-center p-2 rounded-sm"/>
            </div>

            <div className="flex gap-1 max-h-[20rem] overflow-scroll no-scrollbar">
                <div className="flex flex-col gap-1">
                    <HexNumberLine max={memoryContent.length} jump={columnCount} divClassName="flex flex-col size-[4rem] bg-green-400 justify-center p-2 rounded-sm aspect-square" />
                </div>
                <div className={"grid size-fit overflow-scroll no-scrollbar gap-1 " + COLUMN_CHOICE.find((value) => value.count === columnCount)?.cssclass }>
                { 
                    memoryContent.map((value, index) => {
                        return (
                        <div key={index} className="flex flex-col size-[4rem] bg-slate-700 justify-center p-2 rounded-sm">
                            <HexNumber keygen={index} className="text-white" number={value} base10={true} />
                        </div>
                        );
                    })
                }
                </div>
            </div>

        </div>
    );
}