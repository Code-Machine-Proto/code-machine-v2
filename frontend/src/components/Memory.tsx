import { COLUMN_CHOICE } from "@src/constants/Memory";
import { useEffect, useState } from "react";
import HexNumber from "./HexNumber";

export default function Memory({ memoryContent }: { memoryContent: Array<number>}) {
    const [columnCount, setColumnCount] = useState<number>(1);

    useEffect(() => {
        console.log(columnCount);
    }, [columnCount]);
    return (
        <div className="flex flex-col">
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
            <div className={"grid max-h-[20rem] size-fit overflow-scroll no-scrollbar gap-1 " + COLUMN_CHOICE.find((value) => value.count === columnCount)?.cssclass }>
            { 
                memoryContent.map((value, index) => {
                    return (
                    <div className="flex flex-col h-[3rem] w-[3rem] bg-slate-700 justify-center p-2 rounded-sm">
                        <HexNumber key={index} className="text-white" number={value} base10={true} />
                    </div>
                    );
                })
            }
                </div>
        </div>
    );
}