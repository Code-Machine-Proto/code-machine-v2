import type { Visitor } from "@src/interface/VisitorInterface";
import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";

export class ParserVisitor implements Visitor {
    visitAccumultor(processor: Accumultor): void {}
    visitMaAccumulator(processor: MaAccumulator): void {}
    visitPolyRisc(processor: PolyRisc): void {}
}

