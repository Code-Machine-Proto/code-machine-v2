import { useContext } from "react";
import { CodeContext, DispatchCodeContext } from "./CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";

export default function CodeEditor() {
    const codeContext = useContext(CodeContext);
    const dispatch = useContext(DispatchCodeContext);
    return(
        <div className="flex p-5">
            <textarea className="text-white" value={codeContext?.code} onChange={ e => dispatch({ type: CodeAction.CHANGE_CODE, code: e.target.value })} wrap="off"/>
                <p>{ codeContext?.lineTotal }</p>
        </div>
    );
}
