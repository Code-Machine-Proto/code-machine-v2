import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

export default class Accumulator extends Processor {
    defaultCode = "";

    constructor() {
        super(ProcessorId.ACCUMULATOR);
    }
}