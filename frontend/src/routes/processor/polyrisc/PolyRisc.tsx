import { DispatchCodeContext } from "@src/components/code/CodeProvider";
import HexBox from "@src/components/HexBox";
import { ProcessorId } from "@src/interface/CodeInterface";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect } from "react";

/**
 * L'affichage du processeur PolyRisc
 * @returns le composant React a affiché
 */
export default function PolyRiscProcessor() {
    const dispatch = useContext(DispatchCodeContext);
    useEffect(() => {
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, processorId: ProcessorId.RISC })
    }, []);

    return (
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={0} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={0} />
            </div>
        </div>
    );
}