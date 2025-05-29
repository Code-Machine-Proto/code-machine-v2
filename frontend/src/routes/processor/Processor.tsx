import CodeEditor from "@src/components/code/CodeEditor";
import { ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import ExecutionControl from "@src/components/execution/ExecutionControl";
import Memory from "@src/components/Memory";
import { PROCESSOR_ACTIONS } from "@src/constants/Memory";
import { useContext, useState } from "react";
import { Outlet } from "react-router";

/**
 * Layout de la page processeurs pour accueillir une simulation d'un processeur 
 * @returns Le composant de la page des processeur
 */
export default function Processor() {
    const execution = useContext(ExecutionContext);
    const currentStep = useContext(StepContext);

    const [enableMemory, setEnableMemory] = useState<boolean>(false);

    return (
                <div className="flex grow p-5 bg-back gap-5">
                    <CodeEditor />
                    <div className="flex flex-col grow bg-main-950 rounded-xl p-5 gap-5">
                        <ExecutionControl enableMemory={enableMemory} setEnableMemory={setEnableMemory} />
                        <p className="bg-white w-fit p-3 rounded-md">
                                { PROCESSOR_ACTIONS[execution[currentStep].instructionState] }
                        </p>
                        <div className=" flex grow gap-5">
                            <Outlet />
                            { enableMemory && <Memory className="bg-green-500" memoryContent={execution[currentStep].memoryState}/> }
                        </div>
                    </div>
                </div>
    );
}
