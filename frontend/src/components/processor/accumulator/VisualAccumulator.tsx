import { ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import RegisterBox from "@src/components/processor/parts/RegisterBox";
import { useContext } from "react";

export default function VisualAccumulator() {
    const executionContext = useContext(ExecutionContext);
    const currentStep = useContext(StepContext);

    return(
        <>
        <RegisterBox name="PC" className="bg-main-300" number={executionContext[currentStep].pcState} />
        <RegisterBox name="ACC" className="bg-main-300" number={executionContext[currentStep]?.accState ? executionContext[currentStep].accState : 0} />
        <RegisterBox name="IR" className="bg-main-300" number={executionContext[currentStep].irState} />
        </>
    );
}