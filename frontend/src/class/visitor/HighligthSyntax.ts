import type { Visitor } from "@src/interface/VisitorInterface";
import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";

export class HighlightSyntaxVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void{
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-white"}];
        });
    }

    visitMaAccumulator(processor: MaAccumulator): void {
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-white"}];
        });
    }

    visitPolyRisc(processor: PolyRisc): void {
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-white"}];
        });

    }

}
