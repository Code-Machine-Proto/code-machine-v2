import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import { HighlightSyntaxVisitor } from "./visitor/HighligthSyntax";

/**
 * Classe représentant l'état du processeur PolyRisc
 */
export default class PolyRisc extends Processor {
    constructor() {
        super(ProcessorId.RISC);
        this.accept(new HighlightSyntaxVisitor());
    }

    accept(visitor: Visitor) {
        visitor.visitPolyRisc(this);
    }

    clone(): Processor {
        const processor = new PolyRisc();
        return super.internalClone(processor);
    }
}
