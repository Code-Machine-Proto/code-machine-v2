import Accumulator from "@src/class/Accumulator";
import { DispatchCodeContext, ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import VisualAccumulator from "@src/components/processor/accumulator/VisualAccumulator";
import HexBox from "@src/components/utils-hex/HexBox";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect } from "react";
import { useOutletContext } from "react-router";

/**
 * L'affichage du processeur à accumulateur
 * @returns Le composant React du processeur à accumulateur
 */
export default function AccumulatorProcessor() {
    const dispatch = useContext(DispatchCodeContext);
    const steps = useContext(ExecutionContext);
    const { count } = useContext(StepContext);
    const isProgrammerMode = useOutletContext<boolean>();

    useEffect(() => { 
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, newProcessor: new Accumulator() });
    }, [dispatch]);

    return (
        isProgrammerMode ?
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={steps[count].irState} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={steps[count].pcState} />
            </div>
            <div className="bg-[#97ffc8] size-min rounded-md" >
                <HexBox name="ACC" number={steps[count].accState ? steps[count].accState : 0} defaultIsBase10={true} />
            </div>
        </div>
        :
        <VisualAccumulator />
    );
}
