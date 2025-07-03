import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

/**
 * Classe représentant l'état du processeur à accumulateur avec Ma
 */
export default class MaAccumulator extends Processor {
    constructor() {
        super(ProcessorId.MA_ACCUMULATOR);
    }

    clone(): Processor {
        const processor = new MaAccumulator();
        processor.code = this.code;
        processor.lines = this.lines;
        processor.executedCode = this.executedCode;
        return processor;
    }
}
