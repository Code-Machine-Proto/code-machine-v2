import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { SYNTAX_COLOR } from "@src/constants/SyntaxColor";
import type Processor from "@src/class/Processor";
import type { HighlightedLine } from "@src/interface/HighlightedLines";

export class HighlightSyntaxVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void{
        processor.highlightedText = this.applicateColor(processor);
    }

    visitMaAccumulator(processor: MaAccumulator): void {
        processor.highlightedText = this.applicateColor(processor);
    }

    visitPolyRisc(processor: PolyRisc): void {
        processor.highlightedText = this.applicateColor(processor);
    }

    applicateColor(processor: Processor): HighlightedLine[] {
        return processor.tokenizedLines.map((tokenizedLine) => {
            return tokenizedLine.map((token) => {
                return { text: token.value, color: SYNTAX_COLOR[token.type] };
            });
        });
    }

}
