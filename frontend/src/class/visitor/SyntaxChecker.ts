import type Accumulator from "@src/class/Accumulator";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { ComposedTokenType, TokenType, type Token } from "@src/interface/visitor/Token";

export class SyntaxCheckerVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void {
        const filteredTokens: Array<Token | ComposedTokenType> = processor.tokenizedLines.flat().filter((token) => {
            if ( token.type === TokenType.BLANK && token.value.trim() ) {
                token.error = "Certains caractères sont invalides"
            }

            if ( token.type === TokenType.REGISTER ) {
                token.error = "Le processeur à accumulateur ne contient pas de registres"
            }

            return token.type !== TokenType.BLANK && token.type !== TokenType.COMMENT && token.type !== TokenType.REGISTER;
        });


    }
    visitMaAccumulator(processor: MaAccumulator) : void;
    visitPolyRisc(processor: PolyRisc) : void;
}
