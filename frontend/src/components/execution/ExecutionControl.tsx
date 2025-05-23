import { useState } from "react";
import ExecutionButton from "./ExecutionButton";

/**
 * Sert à contrôler l'exécution de la simulation côté frontend une fois utilisé
 * @returns le composant React qui affiche la barre de contrôle 
 */
export default function ExecutionControl() {
    const [checkbox, setCheckBox] = useState<boolean>(false);
    return (
        <div className="flex h-[4rem] items-center gap-5"> 
            <div className="flex flex-col text-white bg-slate-800 p-3 rounded-md">
                <p className="text-xs text-main-400">Mode</p>
                <select className="bg-slate-800 outline-none">
                    <option>Régulier</option>
                    <option>Exécution</option>
                </select>
            </div>
            <div className="flex items-center">
                <ExecutionButton>
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z" />
                </ExecutionButton>
                <ExecutionButton>
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </ExecutionButton>
                <ExecutionButton>
                    <path d="M8 5v14l11-7z" />
                </ExecutionButton>
                <ExecutionButton>
                    <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </ExecutionButton>
                <ExecutionButton>
                    <path d="m4 18 8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </ExecutionButton>
            </div>
            
            <div className="flex text-white items-center">
                <input type="number" className="outline-none bg-slate-800 rounded-md p-2 w-[4rem] text-right" defaultValue={0} min={0} max={0}/>
                <p>/0</p>
            </div>
            <div className="flex items-center gap-1">
                <input type="checkbox" />
                <p className="text-white">Afficher la mémoire</p>
            </div>
            <div className="flex items-center gap-2">
                <label className="switch">
                    <input type="checkbox" checked={checkbox} onClick={() => setCheckBox(!checkbox)}/>
                    <span className="slider rounded-full before:rounded-full" />
                </label>
                <p className="text-white">
                    Basculer au mode {checkbox ? "visuel" : "programmeur"}
                </p>
            </div>
        </div>
    );
}