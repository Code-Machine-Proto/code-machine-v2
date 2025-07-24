import type Accumulator from "@src/class/Accumulator";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { ComposedTokenType, RiscTokenType, TokenType, type ComposedToken, type RiscToken, type Token } from "@src/interface/visitor/Token";
import { SYNTAX_TABLE } from "@src/constants/SyntaxChecker/SyntaxTableAcc";
import { SyntaxState } from "@src/constants/SyntaxChecker/SyntaxCheckerState";
import { CheckerAction, type SyntaxStackAction, type SyntaxTableEntry } from "@src/interface/visitor/SyntaxChecker";
import type Processor from "@src/class/Processor";
import { IMM_LOAD_REGEX, JUMP_POLYRISC, LOAD_REGEX, NO_ARGS_OPERATION_REGEX_ACC, NO_ARGS_OPERATION_REGEX_MA, NO_ARGS_REGEX_POLYRISC, STORE_REGEX, TWO_REG_POLYRISC } from "@src/constants/Regex";
import { INSTRUCTION_ADRESS, JUMP_LABEL, LDI_IMMEDIATE, OPERATION_REGISTER, WARNING_OPERATION } from "@src/constants/SyntaxChecker/ErrorAndWarning";

export class SyntaxCheckerVisitor implements Visitor {
    visitAccumulator(processor: Accumulator): void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        this.checkerExecution(
            input,
            processor,
            (
                input: Array<Token | ComposedToken>,
                checkerStack: Array<Token | ComposedToken>,
                stateStack: Array<SyntaxState>
            ) => this.opReduceAcc(input, checkerStack, stateStack)
        );
    }

    visitMaAccumulator(processor: MaAccumulator) : void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        this.checkerExecution(
            input,
            processor,
            (
                input: Array<Token | ComposedToken>,
                checkerStack: Array<Token | ComposedToken>,
                stateStack: Array<SyntaxState>
            ) => this.opReduceMa(input, checkerStack, stateStack)
        );
    }

    visitPolyRisc(processor: PolyRisc) : void {
        const input: Array<Token | ComposedToken> = this.filterTokens( processor );
        input.push({ type: ComposedTokenType.END_OF_CODE } as ComposedToken);
        this.checkerExecution(
            input,
            processor,
            (
                input: Array<Token | ComposedToken>,
                checkerStack: Array<Token | ComposedToken>,
                stateStack: Array<SyntaxState>
            ) => this.opReducePolyRisc(input, checkerStack, stateStack)
        );
    }

    shiftStack(
        input: Array<Token | ComposedToken>,
        checkerStack: Array<Token | ComposedToken>,
        stateStack: Array<SyntaxState>,
        action: SyntaxTableEntry
    ): Token | ComposedToken | undefined {
        const token = input.shift();
        if ( token ) {
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
                    const ret = reduceOpCallback(input, checkerStack, stateStack);
                    hasError = hasError || ret;
                    break;
                }
            }
        }
        processor.isCompilable = !hasError;
        if ( !hasError ) {
            processor.cleanCode = checkerStack[0].value.split(/\n+/g).map(line => line.trim()).filter(line => line);
        }
    }

    opReduceAcc(input: Array<Token | ComposedToken>, checkerStack: Array<Token | ComposedToken>, stateStack: Array<SyntaxState>): boolean {
        const lastOp = checkerStack.at(-1);
        if ( !lastOp ) return false;
        let number = 1;
        if ( !NO_ARGS_OPERATION_REGEX_ACC.test(lastOp.value) ) {
            number++;
            if ( input[0].type === TokenType.NUMBER ) {
                input[0].warning = WARNING_OPERATION; 
            } else if ( input[0].type !== TokenType.WORD ) {
                input[0].error = INSTRUCTION_ADRESS;
                input.shift();
                return true;
            }
            this.shiftStack(input, checkerStack, stateStack, { type: CheckerAction.SHIFT, number: SyntaxState.DETECT_OPERATION } as SyntaxTableEntry );            
        }
        this.reduceStack(input, checkerStack, stateStack, { type: CheckerAction.REDUCE, number: number, reducedAddition: ComposedTokenType.INSTRUCTION } as SyntaxTableEntry)

        return false;
    }

    opReduceMa(input: Array<Token | ComposedToken>, checkerStack: Array<Token | ComposedToken>, stateStack: Array<SyntaxState>): boolean {
        const lastOp = checkerStack.at(-1);
        if (!lastOp) return false;
        let number = 1;
        if (!NO_ARGS_OPERATION_REGEX_MA.test(lastOp.value)) {
            number++;
            if (input[0].type === TokenType.NUMBER) {
                input[0].warning = WARNING_OPERATION;
            } else if (input[0].type !== TokenType.WORD) {
                input[0].error = INSTRUCTION_ADRESS;
                input.shift();
                return true;
            }
            this.shiftStack(input, checkerStack, stateStack, { type: CheckerAction.SHIFT, number: SyntaxState.DETECT_OPERATION } as SyntaxTableEntry);
        }
        this.reduceStack(input, checkerStack, stateStack, { type: CheckerAction.REDUCE, number: number, reducedAddition: ComposedTokenType.INSTRUCTION } as SyntaxTableEntry)

        return false;
    }

    opReducePolyRisc(input: Array<Token | ComposedToken>, checkerStack: Array<Token | ComposedToken>, stateStack: Array<SyntaxState>): boolean {
        let hasError = false;
        let isFinished = false;
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
            }
        }

        return hasError;
    }

    changeTokenType(token: Token | ComposedToken): RiscToken {
        let type;
        switch ( token.type ) {
            case TokenType.OPERATION: {
                type = RiscTokenType.THREE_REG;

                if ( !this.hasArgs(token.value) ) {
                    type = RiscTokenType.NO_ARGS;
                }

                if ( this.isJump(token.value) ) {
                    type = RiscTokenType.JUMP;
                }

                if ( this.isImmLoad(token.value) ) {
                    type = RiscTokenType.IMM_LOAD;
                }

                if ( this.isLoad(token.value) ) {
                    type = RiscTokenType.LOAD;
                }

                if ( this.isStore(token.value) ) {
                    type = RiscTokenType.STORE;
                }

                if ( this.hasTwoReg(token.value) ) {
                    type = RiscTokenType.TWO_REG;
                }

                break;
            }

            case TokenType.NUMBER: {
                type = RiscTokenType.NUMBER;
                break;
            }

            case TokenType.LABEL: {
                type = RiscTokenType.LABEL;
                break;
            }

            case TokenType.REGISTER: {
                type = RiscTokenType.REGISTER;
                break;
            }

            case ComposedTokenType.INSTRUCTION: {
                type = RiscTokenType.INSTRUCTION;
                break;
            }

            default: {
                type = RiscTokenType.OTHER;
                break;
            }
        }
        return { type: type, value: token.value };
    }

    hasArgs(value: string): boolean {
        return !NO_ARGS_REGEX_POLYRISC.test(value);
    }

    isJump(value: string): boolean {
        return JUMP_POLYRISC.test(value);
    }

    isLoad(value: string): boolean {
        return LOAD_REGEX.test(value);
    }

    isStore(value: string): boolean {
        return STORE_REGEX.test(value);
    }

    isImmLoad(value: string): boolean {
        return IMM_LOAD_REGEX.test(value);
    }

    hasTwoReg(value: string): boolean {
        return TWO_REG_POLYRISC.test(value);
    }
}
