import { useContext, useEffect, useRef, useState } from "react";
import { ProcessorContext, DispatchProcessorContext } from "./CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";
import type { ScrollRef } from "@src/interface/ScrollInterfaces";
import { useFetcher } from "react-router";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import loader from "@src/assets/loader.svg";
import { SnackBarContext } from "@src/components/SnackBarProvider";
import { MessageType } from "@src/constants/SnackBar";
import type Processor from "@src/class/Processor";
import type { SnackBarDispatch } from "@src/interface/SnackBarInterface";
import clearSign from "@src/assets/clear-code.svg";
import { ConfirmationModalContext } from "../ConfirmationModal";
import { DELETE_CODE_MESSAGE } from "@src/constants/ConfirmationModal";
import { TokenType } from "@src/interface/visitor/Token";

/**
 * Éditeur de code pour l'assembleur, assure l'écriture, sa connexion avec l'état global
 * S'affiche automatiquement avec le numéro de ligne juste à côté
 * @returns L'éditeur de code pour écrire de l'assembleur
 */
export default function CodeEditor() {
    const processor = useContext(ProcessorContext);
    const dispatch = useContext(DispatchProcessorContext);
    const setSnackBar = useContext(SnackBarContext);
    const setModal = useContext(ConfirmationModalContext);

    const numberContainer = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const textVisual = useRef<HTMLDivElement>(null);

    const fetcher = useFetcher<{ result: Array<ProcessorStep>, error?: string }>();

    const [lineNumber, setLineNumber] = useState<number>(0);

    useEffect(() => {
        if (fetcher.data && !fetcher.data.error ) {
            setSnackBar({ visible: true, message: "Compilation réussie", type: MessageType.VALID, duration: 3000 });
            dispatch({ type: CodeAction.CHANGE_EXECUTED_CODE, executedCode: fetcher.data.result });
        } else if ( fetcher.data?.error) {
            setSnackBar({ visible: true, message: fetcher.data.error, type: MessageType.ERROR, duration: 3000 });
        }
    }, [fetcher.data, dispatch, setSnackBar]);

    useEffect(() => {
        generateErrorMessage(processor, setSnackBar);
    }, [processor, setSnackBar]);

    useEffect(() => {
        let pcCounter = processor.currentStep.pcState + 1;
        let lineNumber = -1;
        processor.tokenizedLines.find((tokenLine) => {
            if (tokenLine.find(token => token.type === TokenType.OPERATION)) {
                pcCounter--;
            }
            lineNumber++;
            return !pcCounter;
        });
        setLineNumber(lineNumber);
    }, [processor.currentStep.pcState, processor.tokenizedLines]);

    return(
        <div 
            className="flex flex-col p-5 bg-main-950 rounded-xl w-[20rem] gap-2"
        >
            <div className="flex grow gap-2 overflow-hidden">
                <div 
                    className="flex flex-col text-white w-1/5 items-end bg-slate-800 px-2 rounded-md no-scrollbar overflow-scroll pb-24"
                    ref={numberContainer}
                    onScroll={() => {
                        handleVerticalScroll(numberContainer, textArea);
                        handleVerticalScroll(numberContainer, textVisual);
                    }}
                >
                    {processor.lines.map((_, i) => (<p key={i}>{i + 1}</p>))}
                </div>
                <div className="relative">
                    <div className="absolute pointer-events-none size-full no-scrollbar overflow-scroll pb-24" ref={textVisual}>
                        {
                            processor.highlightedText.map((line, iIndex) => {
                                return (
                                    <p key={iIndex} className={`h-6 w-fit mr-24 ${ iIndex === lineNumber ? "border-1 border-main-400 rounded-md bg-main-900/25" : ""}`}>
                                        {
                                            line.map((element, jIndex) => {
                                                return (
                                                    <span key={`${iIndex}-${jIndex}`} className={`whitespace-pre ${element.color}`} >{ element.text }</span>
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
                        className="resize-none border-none outline-none size-full text-transparent caret-white" 
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
            <div className="flex gap-2">
                <button
                    className={
                        `bg-transparent flex ${processor.isCompilable ? "text-main-400 border-main-400 hover:bg-main-900 cursor-pointer" : "text-red-500 border-red-500"
                        } border-2 rounded-md p-2 gap-2 justify-around items-center h-[4rem] w-3/4`
                    }
                    disabled={!processor.isCompilable}
                    onClick={() => {
                        dispatch({ type: CodeAction.RESET_CODE });
                        fetcher.submit({ processor: JSON.stringify(processor) }, { method: "POST", action: "/processor" });
                    }}
                >
                    <div className="size-[2rem]" />
                    <span className="inline-block align-middle" >Compiler</span>
                    <img src={loader} alt="loader" className={`animate-spin size-[2rem] ${fetcher.state === "submitting" ? "visible" : "invisible"}`} />
                </button>
                <button
                    className="border-2 rounded-md w-1/4 border-main-400 flex justify-center items-center cursor-pointer hover:bg-main-900"
                    onClick={() => setModal({ message: DELETE_CODE_MESSAGE, visible: true, payload: { type: CodeAction.CHANGE_CODE, code: "" }})}
                >
                    <img src={clearSign} alt="x" className="size-1/2" />
                </button>
            </div>
        </div>
    );
}

/**
 * Associe deux ScrollElement pour synchronisé le leur. Lien d'une seule direction.
 * Il faut l'utiliser sur les deux onScroll pour bien synchronisé les deux éléments.
 * @param scroller - l'élément qu'on défile
 * @param scrolled - l'élément qu'on veut synchronisé
 */
function handleVerticalScroll(scroller: ScrollRef, scrolled: ScrollRef): void {
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

function generateErrorMessage(processor: Processor, setSnackBar: SnackBarDispatch): void {
    let message = "";
    processor.tokenizedLines.forEach((tokenLine, i)=> {
        tokenLine.forEach(token => {
            if (token.error) {
                message += `Erreur ligne ${i + 1} - ${token.error}\n`; 
            }

            if (token.warning) {
                message += `Avertissement ligne ${i + 1} - ${token.warning}\n`;
            }
        });
    });
    setSnackBar({ visible: !!message, type: MessageType.ERROR, message: message, duration: Infinity });
}
