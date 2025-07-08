import type { Visitor } from "@src/interface/VisitorInterface";
import type Accumulator from "../Accumulator";
import type MaAccumulator from "../MaAccumulator";
import type PolyRisc from "../PolyRisc";

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
            return [{ text: line, color: "text-red-500"}];
        });
    }

    visitPolyRisc(processor: PolyRisc): void {
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-blue-500"}];
        });

    }

}