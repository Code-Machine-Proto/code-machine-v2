import { COLUMN_CHOICE, DEFAULT_COLUMN_NUMBER } from "@src/constants/Memory";
import { useState } from "react";
import HexNumber from "./utils-hex/HexNumber";
import HexNumberLine from "./utils-hex/HexNumberLine";
import HexSwitcher from "./utils-hex/HexSwitcher";
import type { MemoryProps } from "@src/interface/props/Memory";
import { REGISTER_16_BIT } from "@src/constants/HexUtils";

/**
 * Affiche une mémoire à partir d'un tableau 1d
 * @prop memoryContent - Contenu à affiché
 * @prop className - Couleur d'accent de la mémoire
 * @prop stimulatedCell - Cellule à mettre en couleur
 * @prop nom - Nom de la mémoire à afficher
 * @returns le composant react à afficher
 */
export default function Memory({ memoryContent, className, stimulatedCell, nom, registerSize = REGISTER_16_BIT }: MemoryProps) {
    const [columnCount, setColumnCount] = useState<number>(DEFAULT_COLUMN_NUMBER);
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
                <div className="flex flex-col gap-1">
                    <HexSwitcher isBase10={adresseFormat} setIsBase10={setAdressFormat} name="Adresse: " />
                    <HexSwitcher isBase10={memoryCellFormat} setIsBase10={setMemoryCellFormat} name="Donnée: " />
                </div>
            </div>

            <div className="flex gap-1">
                <div className={"flex flex-col size-[4rem] justify-center p-2 rounded-sm " + className} />
                <HexNumberLine 
                    max={columnCount} 
                    divClassName={"flex flex-col h-[4rem] w-[7rem] justify-center p-2 rounded-sm " + className}
                    isBase10={adresseFormat}
                />
            </div>

            <div className="flex gap-1 max-h-[20rem] overflow-scroll no-scrollbar">
                <div className="flex flex-col gap-1">
                    <HexNumberLine 
                        max={memoryContent.length} 
                        jump={columnCount} 
                        divClassName={"flex flex-col size-[4rem] justify-center p-2 rounded-sm aspect-square " + className}
                        isBase10={adresseFormat}
                    />
                </div>
                <div className={"grid size-fit overflow-scroll no-scrollbar gap-1 " + COLUMN_CHOICE.find((value) => value.count === columnCount)?.cssclass }>
                { 
                    memoryContent.map((value, index) => {
                        return (
                        <div 
                            key={index}
                            className={`flex flex-col h-[4rem] w-[7rem] justify-center p-2 rounded-sm ${stimulatedCell === index ? "bg-green-700" : "bg-slate-700"}`}
                        >
                            <HexNumber
                                keygen={index} 
                                className={"text-white"}
                                number={value}
                                isBase10={memoryCellFormat}
                                registerSize={registerSize}
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
