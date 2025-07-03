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
        processor.steps = this.steps;
        processor.count = this.count;
        processor.isPlaying = this.isPlaying;
        processor.mode = this.mode;
        return processor;
    }
}
