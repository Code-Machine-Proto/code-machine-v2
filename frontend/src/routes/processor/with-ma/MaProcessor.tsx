import { DispatchCodeContext, ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import HexBox from "@src/components/HexBox";
import { ProcessorId } from "@src/interface/CodeInterface";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect } from "react";

/**
 * L'affichage du processeur à accumulateur avec registre MA
 * @returns Le composant React a affiché
 */
export default function MaProcessor() {
    const dispatch = useContext(DispatchCodeContext);
    const steps = useContext(ExecutionContext);
    const counter = useContext(StepContext);

    useEffect(() => {
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, processorId: ProcessorId.MA_ACCUMULATOR });
    }, []);
    
    return (
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={steps[counter].irState} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={steps[counter].pcState} />
            </div>
            <div className="bg-[#c2ff97] size-min rounded-md">
                <HexBox name="MA" number={steps[counter].ma ? steps[counter].ma : 0} />
            </div>
            <div className="bg-[#97ffc8] size-min rounded-md">
                <HexBox name="ACC" number={steps[counter].accState ? steps[counter].accState : 0} defaultBase10={true} />
            </div>
        </div>
    );
}