import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";

export interface Visitor {
    visit(processor: Accumulator): void;
    visit(processor: MaAccumulator) : void;
    visit(processor: PolyRisc) : void;
}
