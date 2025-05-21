import { useContext, useEffect, useRef } from "react";
import { CodeContext, DispatchCodeContext } from "./CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";
import type { ScrollElement } from "@src/interface/ScrollInterfaces";

export default function CodeEditor() {
    const codeContext = useContext(CodeContext);
    const dispatch = useContext(DispatchCodeContext);
    const container = useRef<HTMLDivElement>(null);
    const numberContainer = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if (container.current) {
        const height = container.current.offsetHeight;
        container.current.style.maxHeight = `${height}px`;
        }
    }, []);

    return(
        <div 
            className="flex p-5 bg-main-950 rounded-xl w-[20rem] gap-2"
            ref={container}
        >
            <div 
                className="flex flex-col text-white w-1/5 items-end bg-slate-800 px-2 rounded-md no-scrollbar overflow-scroll"
                ref={numberContainer}
                onScroll={() => handleScroll(numberContainer, textArea)}
            >
                { codeContext?.lines.map((_, i) => ( <p>{i + 1}</p>))}
            </div>
            <textarea 
                className="text-white resize-none border-none outline-none w-4/5" 
                value={codeContext?.code} 
                onChange={ e => dispatch({ type: CodeAction.CHANGE_CODE, code: e.target.value })} 
                wrap="off"
                ref={textArea}
                onScroll={() => handleScroll(textArea, numberContainer)}
            />
        </div>
    );
}

function handleScroll(scroller: ScrollElement ,scrolled: ScrollElement): void {
    if( scroller.current && scrolled.current ) {
        scrolled.current.scrollTop = scroller.current.scrollTop;
    }
}
