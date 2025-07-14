import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import { TokenType, type Token } from "@src/interface/visitor/Token";
import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { 
    COMMENT_REGEX,
    LABEL_REGEX,
    MAIN_LABEL_REGEX,
    NUMBER_REGEX,
    OPERATION_REGEX_ACC,
    OPERATION_REGEX_MA,
    OPERATION_REGEX_POLYRISC,
    REGISTER_POLYRISC,
    WHITESPACE_REGEX,
    WORD_REGEX
} from "@src/constants/Regex";
import type Processor from "@src/class/Processor";

/**
 * Classe pour permettre l'implémentation de la syntaxe de chaque processeur
 * Visite et parcourt le code source pour avoir les jetons correspondant
 */
export class ParserVisitor implements Visitor {
    /**
     * Permets de générer les jetons pour le processeur à accumulateur
     */
    visitAccumulator(processor: Accumulator): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
        processor.tokenizedLines = untypedTokenizedLines.map((line) => {
            let commentedLine = false;
            let operationEncountered = false;
            return line.map((token) => {
                if ( commentedLine || COMMENT_REGEX.test(token.value) ) {
                    commentedLine = true;
                    return { type: TokenType.COMMENT, value: token.value };
                }

                if ( !operationEncountered && OPERATION_REGEX_ACC.test(token.value) ) {
                    operationEncountered = true;
                    return { type: TokenType.OPERATION, value: token.value };
                }

                return this.regularSymbolChecker(token);
            });
        });
    }

    /**
     * Permets de générer les jetons pour le processeur à accumulateur avec MA
     */
    visitMaAccumulator(processor: MaAccumulator): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
        processor.tokenizedLines = untypedTokenizedLines.map((line) => {
            let commentedLine = false;
            let operationEncountered = false;
            return line.map((token) => {
                if ( commentedLine || COMMENT_REGEX.test(token.value) ) {
                    commentedLine = true;
                    return { type: TokenType.COMMENT, value: token.value };
                }

                if ( !operationEncountered && OPERATION_REGEX_MA.test(token.value) ) {
                    operationEncountered = true;
                    return { type: TokenType.OPERATION, value: token.value };
                }

                return this.regularSymbolChecker(token);
            });
        });
    }

    /**
     * Permets de générer les jetons pour le processeur PolyRisc
     */
    visitPolyRisc(processor: PolyRisc): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
        processor.tokenizedLines = untypedTokenizedLines.map((line) => {
            let commentedLine = false;
            let operationEncountered = false;
            return line.map((token) => {
                if ( commentedLine || COMMENT_REGEX.test(token.value) ) {
                    commentedLine = true;
                    return { type: TokenType.COMMENT, value: token.value };
                }

                if ( !operationEncountered && OPERATION_REGEX_POLYRISC.test(token.value) ) {
                    operationEncountered = true;
                    return { type: TokenType.OPERATION, value: token.value };
                }

                if( REGISTER_POLYRISC.test(token.value) ) {
                    return { type: TokenType.REGISTER, value: token.value };
                }

                return this.regularSymbolChecker(token);
            });
        });
    }

    /**
     * Permets de séparer le code source par ces "whitespaces"
     */
    private untypedTokenization(processor: Processor): Array<Array<Token>> {
        const lines = processor.lines;
        return lines.map((line) => {
            const tokenizedLine = new Array<Token>();
            const whitespaces = line.matchAll(WHITESPACE_REGEX);
            const splittedText = line.split(WHITESPACE_REGEX);
            splittedText.forEach((element) => {
                if ( element ) {
                    tokenizedLine.push({ value: element, type: TokenType.BLANK });
                }
                const whitespace = whitespaces.next().value?.[0];
                if ( whitespace ) {
                    tokenizedLine.push({ value: whitespace, type: TokenType.BLANK });
                }
            });
            return tokenizedLine;
        });
    }

    /**
     * Permets de générer les jetons communs
     */
    private regularSymbolChecker(token: Token): Token {
        if ( MAIN_LABEL_REGEX.test(token.value) ) {
            return { type: TokenType.MAIN_LABEL, value: token.value };
        }

        if ( LABEL_REGEX.test(token.value) ) {
            return { type: TokenType.LABEL, value: token.value };
        }

        if ( WORD_REGEX.test(token.value) ) {
            return { type: TokenType.WORD, value: token.value };
        }

        if ( NUMBER_REGEX.test(token.value) ) {
            return { type: TokenType.NUMBER, value: token.value };
        }

        return token;
    }
    
}
