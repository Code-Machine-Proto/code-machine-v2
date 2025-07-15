import { ProcessorId } from "@src/interface/CodeInterface";
import Processor from "./Processor";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import { HighlightSyntaxVisitor } from "./visitor/HighligthSyntax";

/**
 * La classe représentant l'état courant de l'accumulateur
 */
export default class Accumulator extends Processor {
    constructor() {
        super(ProcessorId.ACCUMULATOR);
        this.accept(new HighlightSyntaxVisitor());
    }

    accept(visitor: Visitor): void {
        visitor.visitAccumulator(this);
    }

    clone(): Processor {
        const processor = new Accumulator();
        return super.internalClone(processor);
    }
}
