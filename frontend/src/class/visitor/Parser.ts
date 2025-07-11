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
    WHITESPACE_REGEX,
    WORD_REGEX
} from "@src/constants/Regex";
import type Processor from "@src/class/Processor";

export class ParserVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
        processor.tokenizedLines = untypedTokenizedLines.map((line) => {
            let commentedLine = false;
            return line.map((token) => {
                if ( commentedLine || COMMENT_REGEX.test(token.value) ) {
                    commentedLine = true;
                    return { type: TokenType.COMMENT, value: token.value };
                }

                if ( OPERATION_REGEX_ACC.test(token.value) ) {
                    return { type: TokenType.OPERATION, value: token.value };
                }

                return this.regularSymbolChecker(token);
            });
        });
    }

    visitMaAccumulator(processor: MaAccumulator): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
        processor.tokenizedLines = untypedTokenizedLines.map((line) => {
            let commentedLine = false;
            return line.map((token) => {
                if ( commentedLine || COMMENT_REGEX.test(token.value) ) {
                    commentedLine = true;
                    return { type: TokenType.COMMENT, value: token.value };
                }

                if ( OPERATION_REGEX_MA.test(token.value) ) {
                    return { type: TokenType.OPERATION, value: token.value };
                }

                return this.regularSymbolChecker(token);
            });
        });
    }

    visitPolyRisc(processor: PolyRisc): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
    }

    untypedTokenization(processor: Processor): Array<Array<Token>>{
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

    regularSymbolChecker(token: Token): Token {
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
