import Accumulator from "@src/class/Accumulator";
import { ProcessorContext, DispatchProcessorContext } from "@src/components/code/CodeProvider";
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
    const dispatch = useContext(DispatchProcessorContext);
    const currentStep = useContext(ProcessorContext).currentStep;
    const isProgrammerMode = useOutletContext<boolean>();

    useEffect(() => { 
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, newProcessor: new Accumulator() });
    }, [dispatch]);

    return (
        isProgrammerMode ?
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={currentStep.irState} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={currentStep.pcState} />
            </div>
            <div className="bg-[#97ffc8] size-min rounded-md" >
                <HexBox name="ACC" number={currentStep.accState ? currentStep.accState : 0} defaultIsBase10={true} />
            </div>
        </div>
        :
        <VisualAccumulator />
    );
}
