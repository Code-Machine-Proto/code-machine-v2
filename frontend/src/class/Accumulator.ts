import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

/**
 * La classe représentant l'état courant de l'accumulateur
 */
export default class Accumulator extends Processor {
    constructor() {
        super(ProcessorId.ACCUMULATOR);
    }

    clone(): Processor {
        const processor = new Accumulator();
        processor.code = this.code;
        processor.lines = this.lines;
        processor.steps = this.steps;
        processor.count = this.count;
        processor.isPlaying = this.isPlaying;
        processor.mode = this.mode;
        return processor;
    }
}
