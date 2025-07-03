import MaAccumulator from "@src/class/MaAccumulator";
import { CodeContext, DispatchCodeContext } from "@src/components/code/CodeProvider";
import VisualWithMa from "@src/components/processor/with-ma/VisualWithMa";
import HexBox from "@src/components/utils-hex/HexBox";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect } from "react";
import { useOutletContext } from "react-router";

/**
 * L'affichage du processeur à accumulateur avec registre MA
 * @returns Le composant React a affiché
 */
export default function MaProcessor() {
    const dispatch = useContext(DispatchCodeContext);
    const currentStep = useContext(CodeContext).currentStep;
    const isProgrammerMode = useOutletContext();

    useEffect(() => {
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, newProcessor: new MaAccumulator() });
    }, [dispatch]);
    
    return (
        isProgrammerMode ?
        <div className="flex gap-3">
            <div className="bg-ir size-min rounded-md">
                <HexBox name="IR" number={currentStep.irState} />
            </div>
            <div className="bg-pc size-min rounded-md">
                <HexBox name="PC" number={currentStep.pcState} />
            </div>
            <div className="bg-ma size-min rounded-md">
                <HexBox name="MA" number={currentStep.ma ? currentStep.ma : 0} />
            </div>
            <div className="bg-acc size-min rounded-md">
                <HexBox name="ACC" number={currentStep.accState ? currentStep.accState : 0} defaultIsBase10={true} />
            </div>
        </div>
        :
        <VisualWithMa />
    );
}
