import type { Visitor } from "@src/interface/VisitorInterface";
import type Accumulator from "../Accumulator";
import type MaAccumulator from "../MaAccumulator";
import type PolyRisc from "../PolyRisc";

export class HighlightSyntaxVisitor implements Visitor {
    visit(processor: Accumulator): void{
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-white"}];
        });
    }

    visit(processor: MaAccumulator): void {
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-white"}];
        });
    }

    visit(processor: PolyRisc): void {
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            return [{ text: line, color: "text-white"}];
        });

    }

}