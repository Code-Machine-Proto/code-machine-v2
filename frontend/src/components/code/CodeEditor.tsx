import { useContext, useEffect, useRef } from "react";
import { CodeContext, DispatchCodeContext } from "./CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";
import type { ScrollRef } from "@src/interface/ScrollInterfaces";
import { useFetcher } from "react-router";
import type { ProcessorStep } from "@src/interface/ProcessorStep";

/**
 * Éditeur de code pour l'assembleur, assure l'écriture, sa connexion avec l'état global
 * S'affiche automatiquement avec le numéro de ligne juste à côté
 * @returns L'éditeur de code pour écrire de l'assembleur
 */
export default function CodeEditor() {
    const processor = useContext(CodeContext);
    const dispatch = useContext(DispatchCodeContext);

    const numberContainer = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);

    const fetcher = useFetcher();

    useEffect(() => {
        if( fetcher.data ) {
            dispatch({ type: CodeAction.CHANGE_EXECUTED_CODE, executedCode: fetcher.data as Array<ProcessorStep> })
        }
    }, [fetcher.data, dispatch]);
    
    useEffect(() => {
        if (numberContainer.current) {
            const height = numberContainer.current.offsetHeight;
            numberContainer.current.style.maxHeight = `${height}px`;
        }
    }, []);

    return(
        <div 
            className="flex flex-col p-5 bg-main-950 rounded-xl w-[20rem] gap-2"
        >
            <div className="flex grow gap-2">
                <div 
                    className="flex flex-col text-white w-1/5 items-end bg-slate-800 px-2 rounded-md no-scrollbar overflow-scroll"
                    ref={numberContainer}
                    onScroll={() => handleScroll(numberContainer, textArea)}
                >
                    { processor.lines.map((_, i) => ( <p key={i}>{i + 1}</p>))}
                </div>
                <textarea 
                    className="text-white resize-none border-none outline-none w-4/5" 
                    value={ processor.code } 
                    onChange={ e => dispatch({ type: CodeAction.CHANGE_CODE, code: e.target.value as string })} 
                    wrap="off"
                    ref={textArea}
                    onScroll={() => handleScroll(textArea, numberContainer)}
                />
            </div>
            <button 
                className="text-main-400 border-main-400 border-2 rounded-md cursor-pointer bg-transparent hover:bg-main-900"
                onClick={() => {
                    fetcher.submit({ processor: JSON.stringify(processor)   }, { method: "POST", action: "/processor"})
                }}
            >
                Compiler
            </button>
        </div>
    );
}

/**
 * Associe deux ScrollElement pour synchronisé le leur. Lien d'une seule direction.
 * Il faut l'utiliser sur les deux onScroll pour bien synchronisé les deux éléments.
 * @param scroller - l'élément qu'on défile
 * @param scrolled - l'élément qu'on veut synchronisé
 */
function handleScroll(scroller: ScrollRef ,scrolled: ScrollRef): void {
    if( scroller.current && scrolled.current ) {
        scrolled.current.scrollTop = scroller.current.scrollTop;
    }
}
