import type { Visitor } from "@src/interface/VisitorInterface";
import type Accumulator from "../Accumulator";
import type MaAccumulator from "../MaAccumulator";
import type PolyRisc from "../PolyRisc";
import type { HighlightedLine } from "@src/interface/HighlightedLines";

export class HighlightSyntaxVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void{
        const LABEL_REGEX = "[a-zA-Z][a-zA-Z0-9_-]+:";
        const lines = processor.lines;
        processor.highlightedText = lines.map((line) => {
            const highlightedLine: HighlightedLine = [];
            return highlightedLine;
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