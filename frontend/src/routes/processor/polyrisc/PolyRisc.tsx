import PolyRisc from "@src/class/PolyRisc";
import { ProcessorContext, DispatchProcessorContext } from "@src/components/code/CodeProvider";
import Memory from "@src/components/Memory";
import VisualPolyRisc from "@src/components/processor/polyrisc/VisualPolyRisc";
import HexBox from "@src/components/utils-hex/HexBox";
import { CodeAction } from "@src/interface/DispatchCode";
import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router";

/**
 * L'affichage du processeur PolyRisc
 * @returns le composant React a affiché
 */
export default function PolyRiscProcessor() {
    const dispatch = useContext(DispatchProcessorContext);
    const currentStep = useContext(ProcessorContext).currentStep
    const isProgrammerMode = useOutletContext<boolean>();

    const [enableRegister, setEnableRegister] = useState<boolean>(false);
    const [enableInstructionMemory, setEnableInstructionMemory] = useState<boolean>(false);

    useEffect(() => {
        dispatch({ type: CodeAction.CHANGE_PROCESSOR, newProcessor: new PolyRisc() });
    }, [dispatch]);

    return (
        isProgrammerMode ?
        <div className="flex gap-5">
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                    <div className="bg-[#97fcff] size-min rounded-md">
                        <HexBox name="IR" number={currentStep.irState} />
                    </div>
                    <div className="bg-[#abbde5] size-min rounded-md">
                        <HexBox name="PC" number={currentStep.pcState} />
                    </div>
                </div>
            
                <div className="flex items-center gap-1">
                    <input type="checkbox"  checked={enableRegister} onChange={() => setEnableRegister(!enableRegister)}/>
                    <p className="text-white">Afficher les registres</p>
                </div>

                <div className="flex items-center gap-1">
                    <input type="checkbox"  checked={enableInstructionMemory} onChange={() => setEnableInstructionMemory(!enableInstructionMemory)}/>
                    <p className="text-white">Afficher la mémoire d&apos;instruction</p>
                </div>
            </div>
            {
                enableRegister && currentStep.regState &&
                <Memory className="bg-yellow-300" memoryContent={ currentStep.regState } nom="Registres" />
            }

            {
                enableInstructionMemory && currentStep.imState &&
                <Memory className="bg-green-700" memoryContent={ currentStep.imState } nom="Mémoire d'instruction" />
            }
        </div>
        : <VisualPolyRisc />
    );
}
