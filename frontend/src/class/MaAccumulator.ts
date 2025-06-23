import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

/**
 * Classe représentant l'état du processeur à accumulateur avec Ma
 */
export default class MaAccumulator extends Processor {
    defaultCode = "";

    constructor() {
        super(ProcessorId.MA_ACCUMULATOR);
    }
}
