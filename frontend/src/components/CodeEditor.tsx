import { useEffect, useState } from "react";

export default function CodeEditor() {
    const [ code, setCode ] = useState<string>("");
    const [ lineTotal, setLineTotal ] = useState<number>(1);

    useEffect(() => {
        setLineTotal(code.split("\n").length); 
    }, [code]);

    return(
        <div className="flex p-5">
            <textarea className="text-white" value={code} onChange={e => setCode(e.target.value)} wrap="off"/>
        </div>
    );
}
