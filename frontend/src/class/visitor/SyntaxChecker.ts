import type Accumulator from "@src/class/Accumulator";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { ComposedTokenType, TokenType, type ComposedToken, type Token } from "@src/interface/visitor/Token";
import { SYNTAX_TABLE_ACC } from "@src/constants/SyntaxChecker/SyntaxTableAcc";
import { AccumulatorSyntaxState } from "@src/constants/SyntaxChecker/SyntaxCheckerState";
import { CheckerAction, type SyntaxTableEntry } from "@src/interface/visitor/SyntaxChecker";
import type Processor from "@src/class/Processor";

export class SyntaxCheckerVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        processor.isCompilable = !this.checkerExecution(input);
    }

    visitMaAccumulator(processor: MaAccumulator) : void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        processor.isCompilable = !this.checkerExecution(input);
    }

    visitPolyRisc(processor: PolyRisc) : void {}

    shiftStack(
        input: Array<Token | ComposedToken>,
        checkerStack: Array<Token | ComposedToken>,
        stateStack: Array<AccumulatorSyntaxState>,
        action: SyntaxTableEntry
    ): Token | ComposedToken | undefined {
        const token = input.shift();
        if (token) {
            checkerStack.push(token);
            stateStack.push(action.number as AccumulatorSyntaxState);
            return token;
        }
    }

    reduceStack(
        input: Array<Token | ComposedToken>,
        checkerStack: Array<Token | ComposedToken>,
        stateStack: Array<AccumulatorSyntaxState>,
        action: SyntaxTableEntry
    ): void {
        let value = "";
        if (action.number !== undefined && action.reducedAddition) {
            for (let i = 0; i < action.number; i++) {
                value = checkerStack.pop()?.value + value;
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

            if ( token.type === TokenType.REGISTER ) {
                token.error = "Le processeur à accumulateur ne contient pas de registres";
            }

            return token.type !== TokenType.BLANK && token.type !== TokenType.COMMENT && token.type !== TokenType.REGISTER;
        });
    }

    checkerExecution( input: Array<Token | ComposedToken> ): boolean {
        let isFinished = false;
        let hasError = false;
        const checkerStack: Array<Token | ComposedToken> = [];
        const stateStack: Array<AccumulatorSyntaxState> = [AccumulatorSyntaxState.INITIAL];
        while (!isFinished && input.length > 0) {
            const index = stateStack.at(-1);
            const action = SYNTAX_TABLE_ACC[index !== undefined ? index : 1][input[0].type];
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
            }
        }
        return hasError;
    }
}
