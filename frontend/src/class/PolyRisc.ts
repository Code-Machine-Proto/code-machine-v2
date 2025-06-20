import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";

export default class PolyRisc extends Processor {
    defaultCode = "";

    constructor() {
        super(ProcessorId.RISC);
    }
}