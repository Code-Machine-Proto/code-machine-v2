import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { SYNTAX_COLOR } from "@src/constants/SyntaxColor";
import type Processor from "@src/class/Processor";
import type { HighlightedLine } from "@src/interface/HighlightedLines";

/**
 * Visiteur permmetant de mettre en couleur 
 * les différentes instructions et les étiquettes des processeurs
 */
export class HighlightSyntaxVisitor implements Visitor {
    /**
     * Méthode pour appliquer la couleur pour le processeur à accumulateur
     */
    visitAccumulator(processor: Accumulator): void{
        processor.highlightedText = this.applicateColor(processor);
    }

    /**
     * Méthode pour appliquer la couleur pour le processeur à accumulateur avec MA
     */
    visitMaAccumulator(processor: MaAccumulator): void {
        processor.highlightedText = this.applicateColor(processor);
    }

    /**
     * Méthode pour appliquer la couleur pour le processeur PolyRisc
     */
    visitPolyRisc(processor: PolyRisc): void {
        processor.highlightedText = this.applicateColor(processor);
    }

    /**
     * Méthode générale pour appliquer la couleur
     */
    applicateColor(processor: Processor): HighlightedLine[] {
        return processor.tokenizedLines.map((tokenizedLine) => {
            return tokenizedLine.map((token) => {
                const error: boolean = !!token.error;
                const warning: boolean = !!token.warning;
                return {
                    text: token.value,
                    color: `${SYNTAX_COLOR[token.type]}
                    ${error || warning ? "underline decoration-wavy" : ""}
                    ${ error ? "decoration-red-500" : "decoration-yellow-500"}`,
                    error: token.error,
                    warning: token.warning,
                };
            });
        });
    }

}
