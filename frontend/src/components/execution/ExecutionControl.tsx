import { useContext, useEffect, useState } from "react";
import ExecutionButton from "./ExecutionButton";
import { ProcessorContext, DispatchProcessorContext } from "@src/components/code/CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";
import { PlayerMode } from "@src/interface/StepControl";
import type { ExecutionControlProps } from "@src/interface/props/ExecutionControl";

/**
 * Sert à contrôler l'exécution de la simulation côté frontend une fois utilisé
 * @prop enableMemory - si la mémoire est à affiché
 * @prop setEnableMemory - changer la visibilité de la mémoire
 * @returns le composant React qui affiche la barre de contrôle 
 */
export default function ExecutionControl({ memoryState :[enableMemory, setEnableMemory], visualSetting: [isVisualMode, setVisualMode] }: ExecutionControlProps) {
    const dispatch = useContext(DispatchProcessorContext);
    const processor = useContext(ProcessorContext);
    const maxStep = processor.steps.length - 1;
    const [shownStep, setShownStep] = useState<number | undefined>(processor.count);

    useEffect(() => {
        if (shownStep !== undefined) {
            setShownStep(processor.count);
        }
    },[setShownStep, processor.count])

    return (
        <div className="flex h-[4rem] items-center gap-5"> 
            <div className="flex flex-col text-white bg-slate-800 p-3 rounded-md">
                <p className="text-xs text-main-400">Mode</p>
                <select className="bg-slate-800 outline-none" onChange={(e) => dispatch({ type: CodeAction.CHANGE_MODE, mode: e.target.value as PlayerMode })}>
                    <option value={PlayerMode.regular}>Régulier</option>
                    <option value={PlayerMode.execution}>Exécution</option>
                </select>
            </div>
            <div className="flex items-center">
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.TO_START })}>
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.BACKWARD })}>
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.PLAY_AND_PAUSE })}>
                    {
                    processor.isPlaying ?
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> :
                    <path d="M8 5v14l11-7z" />
                    }
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.FORWARD })}>
                    <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </ExecutionButton>
                <ExecutionButton onClick={() => dispatch({ type: CodeAction.TO_END })}>
                    <path d="m4 18 8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </ExecutionButton>
            </div>
            
            <div className="flex text-white items-center">
                <input
                    type="number"
                    className="outline-none bg-slate-800 rounded-md p-2 w-[4rem] text-right"
                    value={shownStep}
                    min={0}
                    max={maxStep}
                    onChange={(e) => {
                        dispatch({ type: CodeAction.CHANGE_STEP, newStep: e.target.valueAsNumber });
                        setShownStep(e.target.valueAsNumber > maxStep ? maxStep : e.target.valueAsNumber);
                    }}
                />
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
