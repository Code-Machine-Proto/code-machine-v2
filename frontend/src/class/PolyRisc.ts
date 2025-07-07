import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";
import type { Visitor } from "@src/interface/VisitorInterface";
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
        visitor.visit(this);
    }

    clone(): Processor {
        const processor = new PolyRisc();
        return super.internalClone(processor);
    }
}
