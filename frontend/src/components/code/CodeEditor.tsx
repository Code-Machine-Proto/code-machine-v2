import { useContext, useEffect, useRef } from "react";
import { ProcessorContext, DispatchProcessorContext } from "./CodeProvider";
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
    const processor = useContext(ProcessorContext);
    const dispatch = useContext(DispatchProcessorContext);

    const numberContainer = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const textVisual = useRef<HTMLDivElement>(null);

    const fetcher = useFetcher();

    useEffect(() => {
        if( fetcher.data ) {
            dispatch({ type: CodeAction.CHANGE_EXECUTED_CODE, executedCode: fetcher.data as Array<ProcessorStep> })
        }
    }, [fetcher.data, dispatch]);
    
    return(
        <div 
            className="flex flex-col p-5 bg-main-950 rounded-xl w-[20rem] gap-2"
        >
            <div className="flex grow gap-2 overflow-hidden">
                <div 
                    className="flex flex-col text-white w-1/5 items-end bg-slate-800 px-2 rounded-md no-scrollbar overflow-scroll"
                    ref={numberContainer}
                    onScroll={() => {
                        handleVerticalScroll(numberContainer, textArea);
                        handleVerticalScroll(numberContainer, textVisual);
                    }}
                >
                    { processor.lines.map((_, i) => ( <p key={i}>{i + 1}</p>))}
                </div>
                <div className="relative">
                    <div className="absolute pointer-events-none size-full no-scrollbar overflow-scroll" ref={textVisual}>
                        {
                            processor.highlightedText.map((line, iindex) => {
                                return (
                                    <p key={iindex} className="h-6">
                                        {
                                            line.map((element, jindex) => {
                                                return (
                                                    <span key={`${iindex}-${jindex}`} className={`whitespace-pre ${element.color}`} >{ element.text }</span>
                                                );
                                            })
                                        }
                                    </p>
                                );
                            })
                        }
                    </div>
                    <textarea 
                        spellCheck="false"
                        className="resize-none border-none outline-none size-full text-transparent caret-white no-scrollbar" 
                        value={ processor.code } 
                        onChange={ e => dispatch({ type: CodeAction.CHANGE_CODE, code: e.target.value as string })} 
                        wrap="off"
                        ref={textArea}
                        onScroll={() => {
                            handleVerticalScroll(textArea, numberContainer);
                            handleVerticalScroll(textArea, textVisual);
                            handleHorizontalScroll(textArea, textVisual);
                        }}
                    />
                </div>
            </div>
            <button 
                className="text-main-400 border-main-400 border-2 rounded-md cursor-pointer bg-transparent hover:bg-main-900"
                onClick={() => {
                    dispatch({ type: CodeAction.RESET_CODE });
                    fetcher.submit({ processor: JSON.stringify(processor) }, { method: "POST", action: "/processor" });
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
function handleVerticalScroll(scroller: ScrollRef ,scrolled: ScrollRef): void {
    if( scroller.current && scrolled.current ) {
        scrolled.current.scrollTop = scroller.current.scrollTop;
    }
}

/**
 * Associe le défilement horizontal de deux éléments html ensembles
 * Le lien ce fait d'une seule direction pour bien synchronisé deux éléments
 * il faut le faire avec les paramètres inversés
 * @param scroller - l'élément qu'on défile
 * @param scrolled - l'élément qu'on veut synchronisé
 */
function handleHorizontalScroll(scroller: ScrollRef, scrolled: ScrollRef): void {
    if ( scroller.current && scrolled.current ) {
        scrolled.current.scrollLeft = scroller.current.scrollLeft;
    }
}

