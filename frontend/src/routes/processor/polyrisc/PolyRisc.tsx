import PolyRisc from "@src/class/PolyRisc";
import { DispatchCodeContext, ExecutionContext, StepContext } from "@src/components/code/CodeProvider";
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
    const dispatch = useContext(DispatchCodeContext);
    const steps = useContext(ExecutionContext);
    const { count } = useContext(StepContext);
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
                        <HexBox name="IR" number={steps[count].irState} />
                    </div>
                    <div className="bg-[#abbde5] size-min rounded-md">
                        <HexBox name="PC" number={steps[count].pcState} />
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
                enableRegister && steps[count].regState &&
                <Memory className="bg-yellow-300" memoryContent={ steps[count].regState } nom="Registres" />
            }

            {
                enableInstructionMemory && steps[count].imState &&
                <Memory className="bg-green-700" memoryContent={ steps[count].imState } nom="Mémoire d'instruction" />
            }
        </div>
        : <VisualPolyRisc />
    );
}
