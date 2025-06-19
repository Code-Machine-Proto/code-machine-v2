import { DispatchCodeContext, ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
import Memory from "@src/components/Memory";
import VisualPolyRisc from "@src/components/processor/polyrisc/VisualPolyRisc";
import HexBox from "@src/components/utils-hex/HexBox";
import { DEFAULT_POLYRISC_CODE } from "@src/constants/CodeProvider";
import { ProcessorId } from "@src/interface/CodeInterface";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router";

/**
 * L'affichage du processeur PolyRisc
 * @returns le composant React a affiché
 */
export default function PolyRiscProcessor() {
    const dispatch = useContext(DispatchCodeContext);
    const steps = useContext(ExecutionContext);
    const counter = useContext(StepContext);
    const isProgrammerMode = useOutletContext<boolean>();

    const [enableMemory, setEnableMemory] = useState<boolean>(false);

    useEffect(() => {
        let code = localStorage.getItem(`code-${ProcessorId.RISC}`);
        if (!code) {
            code = DEFAULT_POLYRISC_CODE;
        }
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, processorId: ProcessorId.RISC });
        dispatch({ type: CodeAction.CHANGE_CODE, code: code});
    }, [dispatch]);

    return (
        isProgrammerMode ?
        <div className="flex gap-5">
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <div className="bg-[#97fcff] size-min rounded-md">
                        <HexBox name="IR" number={steps[counter].irState} />
                    </div>
                    <div className="bg-[#abbde5] size-min rounded-md">
                        <HexBox name="PC" number={steps[counter].pcState} />
                    </div>
                </div>
            
                <div className="flex items-center gap-1">
                    <input type="checkbox"  checked={enableMemory} onChange={() => setEnableMemory(!enableMemory)}/>
                    <p className="text-white">Afficher les registres</p>
                </div>
            </div>
            {
                enableMemory && steps[counter].regState &&
                <Memory className="bg-yellow-300" memoryContent={ steps[counter].regState } nom="Registres" />
            }
        </div>
        : <VisualPolyRisc />
    );
}
