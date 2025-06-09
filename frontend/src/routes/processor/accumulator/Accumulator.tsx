import { DispatchCodeContext, ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import HexBox from "@src/components/utils-hex/HexBox";
import { ProcessorId } from "@src/interface/CodeInterface";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect } from "react";

/**
 * L'affichage du processeur à accumulateur
 * @returns Le composant React du processeur à accumulateur
 */
export default function AccumulatorProcessor() {
    const dispatch = useContext(DispatchCodeContext);
    const steps = useContext(ExecutionContext);
    const counter = useContext(StepContext);

    useEffect(() => {
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, processorId: ProcessorId.ACCUMULATOR });
    }, [dispatch]);

    return (
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={steps[counter].irState} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={steps[counter].pcState} />
            </div>
            <div className="bg-[#97ffc8] size-min rounded-md" >
                <HexBox name="ACC" number={steps[counter].accState ? steps[counter].accState : 0} defaultIsBase10={true} />
            </div>
        </div>
    );
}
