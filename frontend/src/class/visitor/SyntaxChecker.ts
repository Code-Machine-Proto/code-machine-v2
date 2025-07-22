import type Accumulator from "@src/class/Accumulator";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { ComposedTokenType, TokenType, type ComposedToken, type Token } from "@src/interface/visitor/Token";
import { SYNTAX_TABLE } from "@src/constants/SyntaxChecker/SyntaxTableAcc";
import { SyntaxState } from "@src/constants/SyntaxChecker/SyntaxCheckerState";
import { CheckerAction, type SyntaxStackAction, type SyntaxTableEntry } from "@src/interface/visitor/SyntaxChecker";
import type Processor from "@src/class/Processor";

export class SyntaxCheckerVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        this.checkerExecution(input, processor);
    }

    visitMaAccumulator(processor: MaAccumulator) : void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        this.checkerExecution(input, processor);
    }

    visitPolyRisc(processor: PolyRisc) : void {}

    shiftStack(
        input: Array<Token | ComposedToken>,
        checkerStack: Array<Token | ComposedToken>,
        stateStack: Array<SyntaxState>,
        action: SyntaxTableEntry
    ): Token | ComposedToken | undefined {
        const token = input.shift();
        if (token) {
            checkerStack.push(token);
            stateStack.push(action.number as SyntaxState);
            return token;
        }
    }

    reduceStack(
        input: Array<Token | ComposedToken>,
        checkerStack: Array<Token | ComposedToken>,
        stateStack: Array<SyntaxState>,
        action: SyntaxTableEntry
    ): void {
        let value = "";
        if (action.number !== undefined && action.reducedAddition) {
            for (let i = 0; i < action.number; i++) {
                value = checkerStack.pop()?.value + " " + value;
                stateStack.pop();
            }
            value = "\n" + value;
            input.unshift({ type: action.reducedAddition, value: value } as ComposedToken);
        }
    }

    filterTokens( processor: Processor ) {
        return processor.tokenizedLines.flat().filter((token) => {
            if ( token.type === TokenType.BLANK && token.value.trim() ) {
                token.error = "Certains caractères sont invalides";
            }

            return token.type !== TokenType.BLANK && token.type !== TokenType.COMMENT;
        });
    }

    checkerExecution( input: Array<Token | ComposedToken>, processor: Processor, reduceOpCallback: SyntaxStackAction ): void {
        let isFinished = false;
        let hasError = false;
        const checkerStack: Array<Token | ComposedToken> = [];
        const stateStack: Array<SyntaxState> = [SyntaxState.INITIAL];
        while (!isFinished && input.length > 0) {
            const index = stateStack.at(-1);
            const action = SYNTAX_TABLE[index !== undefined ? index : SyntaxState.COMPLETE_PROGRAM][input[0].type];
            switch (action.type) {
                case CheckerAction.ACCEPT: {
                    isFinished = true;
                    break;
                }

                case CheckerAction.ERROR: {
                    hasError = true;
                    const token = input.shift();
                    if (token) {
                        token.error = action.message;
                    }
                    break;
                }

                case CheckerAction.REDUCE: {
                    this.reduceStack(input, checkerStack, stateStack, action);
                    break;
                }

                case CheckerAction.SHIFT: {
                    const token = this.shiftStack(input, checkerStack, stateStack, action);
                    if (token) {
                        token.warning = action.message;
                    }
                    break;
                }

                case CheckerAction.OP_REDUCE: {
                    reduceOpCallback(input, checkerStack, stateStack);
                    break;
                }
            }
        }
        processor.isCompilable = !hasError;
        if ( !hasError ) {
            processor.cleanCode = checkerStack[0].value.split(/\n+/g).map(line => line.trim()).filter(line => line);
        }
    }
}
