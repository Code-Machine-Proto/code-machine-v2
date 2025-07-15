import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";

/**
 * Interface commune à tous les visiteurs définit les différents accept possible
 */
export interface Visitor {
    visitAccumulator(processor: Accumulator): void;
    visitMaAccumulator(processor: MaAccumulator) : void;
    visitPolyRisc(processor: PolyRisc) : void;
}
