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
        processor.steps = this.steps;
        processor.count = this.count;
        processor.isPlaying = this.isPlaying;
        processor.mode = this.mode;
        return processor;
    }
}
