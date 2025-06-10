import { useContext, useState } from "react";
import ExecutionButton from "./ExecutionButton";
import { DispatchCodeContext, ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";
import type { ExecutionControlProps } from "@src/interface/ExecutionControlProps";

/**
 * Sert à contrôler l'exécution de la simulation côté frontend une fois utilisé
 * @prop enableMemory - si la mémoire est à affiché
 * @prop setEnableMemory - changer la visibilité de la mémoire
 * @returns le composant React qui affiche la barre de contrôle 
 */
export default function ExecutionControl({ memoryState :[enableMemory, setEnableMemory], visualSetting: [isVisualMode, setVisualMode] }: ExecutionControlProps) {
    const dispatch = useContext(DispatchCodeContext);
    const currentStep = useContext(StepContext);
    const maxStep = useContext(ExecutionContext).length - 1;

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
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.TO_START })}>
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.BACKWARD })}>
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => {}}>
                    <path d="M8 5v14l11-7z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.FORWARD })}>
                    <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.TO_END })}>
                    <path d="m4 18 8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </ExecutionButton>
            </div>
            
            <div className="flex text-white items-center">
                <input type="number" disabled className="outline-none bg-slate-800 rounded-md p-2 w-[4rem] text-right" value={currentStep} min={0} max={maxStep}/>
                <p>/{ maxStep }</p>
            </div>
            <div className="flex items-center gap-1">
                <input type="checkbox"  checked={enableMemory} onChange={() => setEnableMemory(!enableMemory)}/>
                <p className="text-white">Afficher la mémoire</p>
            </div>
            <div className="flex items-center gap-2">
                <label className="switch">
                    <input type="checkbox" checked={isVisualMode} onChange={() => setVisualMode(!isVisualMode)} />
                    <span className="slider rounded-full before:rounded-full" />
                </label>
                <p className="text-white">
                    Basculer au mode {isVisualMode? "visuel" : "programmeur"}
                </p>
            </div>
        </div>
    );
}
