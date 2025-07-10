import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import { TokenType, type Token } from "@src/interface/visitor/Token";
import type Accumulator from "@src/class/Accumulator";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { COMMENT_REGEX, LABEL_REGEX, MAIN_LABEL_REGEX, NUMBER_REGEX, OPERATION_REGEX_ACC, WHITESPACE_REGEX, WORD_REGEX } from "@src/constants/Regex";
import type Processor from "../Processor";

export class ParserVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
        processor.tokenizedLines = untypedTokenizedLines.map((line) => {
            let commentedLine = false;
            return line.map((token) => {
                if ( commentedLine || COMMENT_REGEX.test(token.value) ) {
                    commentedLine = true;
                    token.type = TokenType.COMMENT;
                    return token;
                }

                if ( MAIN_LABEL_REGEX.test(token.value) ) {
                    token.type = TokenType.MAIN_LABEL;
                    return token;
                }

                if ( WORD_REGEX.test(token.value) ) {
                    token.type = TokenType.WORD;                    
                    return token;
                }

                if ( LABEL_REGEX.test(token.value) ) {
                    token.type = TokenType.LABEL;
                    return token;
                }

                if ( OPERATION_REGEX_ACC.test(token.value) ) {
                    token.type = TokenType.OPERATION;
                    return token;
                }

                if ( NUMBER_REGEX.test(token.value) ) {
                    token.type = TokenType.NUMBER;
                    return token;
                }

                return token;
            });
        });
    }

    visitMaAccumulator(processor: MaAccumulator): void {
        const untypedTokenizedLines = this.untypedTokenization(processor);
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
}

