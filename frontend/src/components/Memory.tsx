import { COLUMN_CHOICE } from "@src/constants/Memory";
import { useState } from "react";
import HexNumber from "./utils-hex/HexNumber";
import HexNumberLine from "./utils-hex/HexNumberLine";
import HexSwitcher from "./utils-hex/HexSwitcher";

export default function Memory({ memoryContent, className, stimulatedCell, nom }: { memoryContent: Array<number>, className: string, stimulatedCell?: number, nom: string }) {
    const [columnCount, setColumnCount] = useState<number>(4);
    const [adresseFormat, setAdressFormat] = useState<boolean>(false);
    const [memoryCellFormat, setMemoryCellFormat] = useState<boolean>(true);

    return (
        <div className="flex flex-col gap-1">
            <p className="text-white text-2xl">{ nom }</p> 
            <div className="flex gap-2">
                <div className="flex flex-col text-white bg-slate-800 p-3 rounded-md">
                    <p className="text-xs text-main-400">Mode</p>
                    <select value={columnCount} className="bg-slate-800 outline-none" onChange={(event) => setColumnCount(parseInt(event.target.value))}>
                        {
                            COLUMN_CHOICE.map((value, index) => <option key={index}>{value.count}</option>)
                        }
                    </select>
                </div> 
                <HexSwitcher base10={adresseFormat} setBase10={setAdressFormat} name="Adresse: " />
                <HexSwitcher base10={memoryCellFormat} setBase10={setMemoryCellFormat} name="Donnée: " />
            </div>

            <div className="flex gap-1">
                <div className={"flex flex-col size-[4rem] justify-center p-2 rounded-sm " + className} />
                <HexNumberLine 
                    max={columnCount} 
                    divClassName={"flex flex-col size-[4rem] justify-center p-2 rounded-sm " + className}
                    base10={adresseFormat}
                />
            </div>

            <div className="flex gap-1 max-h-[20rem] overflow-scroll no-scrollbar">
                <div className="flex flex-col gap-1">
                    <HexNumberLine 
                        max={memoryContent.length} 
                        jump={columnCount} 
                        divClassName={"flex flex-col size-[4rem] justify-center p-2 rounded-sm aspect-square " + className}
                        base10={adresseFormat}
                    />
                </div>
                <div className={"grid size-fit overflow-scroll no-scrollbar gap-1 " + COLUMN_CHOICE.find((value) => value.count === columnCount)?.cssclass }>
                { 
                    memoryContent.map((value, index) => {
                        return (
                        <div 
                            key={index}
                            className={`flex flex-col size-[4rem] justify-center p-2 rounded-sm ${stimulatedCell === index ? "bg-green-700" : "bg-slate-700"}`}
                        >
                            <HexNumber 
                                keygen={index} 
                                className={"text-white"}
                                number={value}
                                base10={memoryCellFormat}
                            />
                        </div>
                        );
                    })
                }
                </div>
            </div>

        </div>
    );
}