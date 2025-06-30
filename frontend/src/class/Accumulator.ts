import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

/**
 * La classe représentant l'état courant de l'accumulateur
 */
export default class Accumulator extends Processor {
    defaultCode = "";

    constructor() {
        super(ProcessorId.ACCUMULATOR);
    }
}
