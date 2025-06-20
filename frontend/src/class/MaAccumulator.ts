import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

export default class MaAccumulator extends Processor {
    defaultCode = "";

    constructor() {
        super(ProcessorId.MA_ACCUMULATOR);
    }
}