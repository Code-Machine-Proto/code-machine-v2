import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

/**
 * Classe représentant l'état du processeur PolyRisc
 */
export default class PolyRisc extends Processor {
    defaultCode = "";

    constructor() {
        super(ProcessorId.RISC);
    }
}
