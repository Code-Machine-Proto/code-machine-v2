import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

/**
 * Classe représentant l'état du processeur PolyRisc
 */
export default class PolyRisc extends Processor {
    constructor() {
        super(ProcessorId.RISC);
    }

    clone(): Processor {
        const processor = new PolyRisc();
        processor.code = this.code;
        processor.lines = this.lines;
        processor.executedCode = this.executedCode;
        return processor;
    }
}
