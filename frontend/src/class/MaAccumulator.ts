import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import { HighlightSyntaxVisitor } from "./visitor/HighligthSyntax";

/**
 * Classe représentant l'état du processeur à accumulateur avec Ma
 */
export default class MaAccumulator extends Processor {
    constructor() {
        super(ProcessorId.MA_ACCUMULATOR);
        this.accept(new HighlightSyntaxVisitor());
    }

    accept(visitor: Visitor) {
        visitor.visitMaAccumulator(this);
    }

    clone(): Processor {
        const processor = new MaAccumulator();
        return super.internalClone(processor);
    }
}
