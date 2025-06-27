import BoxLink from "@src/components/BoxLink";
import { ProcessorId } from "@src/interface/CodeInterface";
import { hasCode, storeCode } from "@src/module-store/CodeStore";
import { useEffect } from "react";

/**
 * Composant de la page principale et permets la navigation entre les différents processeurs
 * 
 * @returns le composant React a affiché
 */
export default function Home() {
    useEffect(() => {
        if ( !hasCode(ProcessorId.ACCUMULATOR) ) {
            storeCode(ProcessorId.ACCUMULATOR, ".text");
        }
        if ( !hasCode(ProcessorId.MA_ACCUMULATOR) ) {
            storeCode(ProcessorId.MA_ACCUMULATOR, ".text");
        }
        if ( !hasCode(ProcessorId.RISC) ) {
            storeCode(ProcessorId.RISC, ".text");
        }
    },[]);
    return (
    <div className="bg-back flex grow flex-col gap-5 p-5" >
        <p className="text-white text-4xl">Naviguez les processeurs</p>
        <div className="flex gap-5">
            <BoxLink nom="Accumulateur" url="/processor/accumulator" />
            <BoxLink nom="Accumulateur avec registre MA" url="/processor/with-ma" />
            <BoxLink nom="PolyRisc" url="/processor/polyrisc" />
        </div>
    </div>
    );
}
