import type Accumulator from "@src/class/Accumulator";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import type MaAccumulator from "@src/class/MaAccumulator";
import type PolyRisc from "@src/class/PolyRisc";
import { ComposedTokenType, RiscTokenType, TokenType, type ComposedToken, type RiscToken, type Token } from "@src/interface/visitor/Token";
import { SYNTAX_TABLE } from "@src/constants/SyntaxChecker/SyntaxTableAcc";
import { RiscSyntaxState, SyntaxState } from "@src/constants/SyntaxChecker/SyntaxCheckerState";
import { CheckerAction, type SyntaxStackAction, type SyntaxTableEntry } from "@src/interface/visitor/SyntaxChecker";
import type Processor from "@src/class/Processor";
import { IMM_LOAD_REGEX, JUMP_POLYRISC, LOAD_REGEX, NO_ARGS_OPERATION_REGEX_ACC, NO_ARGS_OPERATION_REGEX_MA, NO_ARGS_REGEX_POLYRISC, SIMPLE_REGISTER_POLYRISC, STORE_REGEX, TWO_REG_POLYRISC } from "@src/constants/Regex";
import { INSTRUCTION_ADRESS, INT_OVERFLOW, LABEL_INEXISTANT, WARNING_OPERATION, DUPLICATE_LABEL } from "@src/constants/SyntaxChecker/ErrorAndWarning";
import { RISC_SYNTAX_TABLE } from "@src/constants/SyntaxChecker/RiscSyntaxTable";
import { RegisterFormat } from "@src/interface/visitor/RegisterFormat";
import { BASE_RISC_TOKEN, MAX_INT32, MIN_INT32 } from "@src/constants/SyntaxChecker/BaseToken";

export class SyntaxCheckerVisitor implements Visitor {
    private labelArray: Array<Token> = [];
    private hasNumberError = false;

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

    reduceRiscStack(
        riscCheckerStack: Array<RiscToken>,
        riscStateStack: Array<RiscSyntaxState>,
        action: SyntaxTableEntry
    ): string {
        let value = "";
        if (action.number !== undefined) {
            for (let i = 0; i < action.number; i++) {
                value = riscCheckerStack.pop()?.value + " " + value;
                riscStateStack.pop();
            }
            value = "\n" + value;
        }
        return value;
    }

    filterTokens( processor: Processor ) {
        return processor.tokenizedLines.flat().filter((token) => {
            if ( token.type === TokenType.BLANK && token.value.trim() ) {
                token.error = "Certains caractères sont invalides";
            }

            const number = parseInt(token.value);
            if (token.type === TokenType.NUMBER && (number > MAX_INT32 || number < MIN_INT32)) {
                token.error = INT_OVERFLOW;
                this.hasNumberError = true;
            }

            if ( token.type === TokenType.LABEL ) {
                if (this.labelArray.find(tk => tk.value === token.value)) {
                    token.error = DUPLICATE_LABEL;
                }
                this.labelArray.push(token);
            }

            return token.type !== TokenType.BLANK && token.type !== TokenType.COMMENT;
        });
    }

    checkerExecution( input: Array<Token | ComposedToken>, processor: Processor, reduceOpCallback: SyntaxStackAction ): void {
        let isFinished = false;
        let hasError = !!input.find(token => token.error);
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
        processor.isCompilable = !(hasError || this.hasNumberError);
        if ( !hasError ) {
            processor.cleanCode = checkerStack[0].value.split(/\n+/g).map(line => line.trim()).filter(line => line);
        }
    }

    opReduceAcc(input: Array<Token | ComposedToken>, checkerStack: Array<Token | ComposedToken>, stateStack: Array<SyntaxState>): boolean {
        const lastOp = checkerStack.at(-1);
        let hasLabelError = false;
        if ( !lastOp ) { return false; }
        let number = 1;
        if ( !NO_ARGS_OPERATION_REGEX_ACC.test(lastOp.value) ) {
            number++;
            if ( input[0].type === TokenType.NUMBER ) {
                input[0].warning = WARNING_OPERATION; 
            } else if ( input[0].type !== TokenType.WORD ) {
                input[0].error = INSTRUCTION_ADRESS;
                input.shift();
                return true;
            } else {
                if (!this.labelArray.find(label => label.value === input[0].value + ":")) {
                    input[0].error = LABEL_INEXISTANT;
                    hasLabelError = true;
                }
            }
            this.shiftStack(input, checkerStack, stateStack, { type: CheckerAction.SHIFT, number: SyntaxState.DETECT_OPERATION } as SyntaxTableEntry );            
        }
        this.reduceStack(input, checkerStack, stateStack, { type: CheckerAction.REDUCE, number: number, reducedAddition: ComposedTokenType.INSTRUCTION } as SyntaxTableEntry)

        return hasLabelError;
    }

    opReduceMa(input: Array<Token | ComposedToken>, checkerStack: Array<Token | ComposedToken>, stateStack: Array<SyntaxState>): boolean {
        let hasLabelError = false;
        const lastOp = checkerStack.at(-1);
        if (!lastOp) { return false; }
        let number = 1;
        if (!NO_ARGS_OPERATION_REGEX_MA.test(lastOp.value)) {
            number++;
            if (input[0].type === TokenType.NUMBER) {
                input[0].warning = WARNING_OPERATION;
            } else if (input[0].type !== TokenType.WORD) {
                input[0].error = INSTRUCTION_ADRESS;
                input.shift();
                return true;
            } else {
                if (!this.labelArray.find(label => label.value === input[0].value + ":")) {
                    input[0].error = LABEL_INEXISTANT;
                    hasLabelError = true;
                }
            }
            this.shiftStack(input, checkerStack, stateStack, { type: CheckerAction.SHIFT, number: SyntaxState.DETECT_OPERATION } as SyntaxTableEntry);
        }
        this.reduceStack(input, checkerStack, stateStack, { type: CheckerAction.REDUCE, number: number, reducedAddition: ComposedTokenType.INSTRUCTION } as SyntaxTableEntry)

        return hasLabelError;
    }

    opReducePolyRisc(input: Array<Token | ComposedToken>, checkerStack: Array<Token | ComposedToken>, stateStack: Array<SyntaxState>): boolean {
        let hasError = false;
        let isFinished = false;
        const riscCheckerStack: Array<RiscToken> = [];
        const riscStateStack: Array<RiscSyntaxState> = [RiscSyntaxState.INITIAL];

        const operation = checkerStack.pop();
        stateStack.pop();
        if ( operation ) {
            input.unshift(operation);
        }

        let lastReduceValue: string | null = null;

        while (!isFinished && input.length > 0) {
            const riscInput = this.changeTokenType(input[0]);
            if (lastReduceValue) {
                riscInput.value = lastReduceValue;
                lastReduceValue = null;
            }
            const index = riscStateStack.at(-1);
            const action = RISC_SYNTAX_TABLE[index !== undefined ? index : RiscSyntaxState.EXIT][riscInput.type];
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
                    if (index === RiscSyntaxState.LABEL_ARGS) {
                        const token = checkerStack.at(-1);
                        if (token && !this.labelArray.find(tk => tk.value === token.value + ":")) {
                            hasError = true;
                            token.error = LABEL_INEXISTANT;
                        }
                    }
                    this.formatArguments(riscCheckerStack, index ? index : RiscSyntaxState.EXIT, action);
                    this.reduceStack(input, checkerStack, stateStack, action);
                    lastReduceValue = this.reduceRiscStack(riscCheckerStack, riscStateStack, action);
                    break;
                }

                case CheckerAction.SHIFT: {
                    riscCheckerStack.push(riscInput);
                    riscStateStack.push(action.number as RiscSyntaxState);
                    const token = this.shiftStack(input, checkerStack, stateStack, { type: action.type, number: SyntaxState.COMPLETE_PROGRAM });
                    if (token) {
                        token.warning = action.message;
                    }
                    break;
                }
            }
        }
        stateStack.pop();
        stateStack.push(SyntaxState.REDUCE_INST);
        const cleanValue = riscCheckerStack.at(-1)?.value.replaceAll("\n", "");
        const realToken = checkerStack.at(-1);
        if ( realToken && cleanValue ) {
            realToken.value = cleanValue;
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

            case TokenType.WORD: {
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

            case TokenType.BLANK: {
                type = RiscTokenType.ARGUMENTS;
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

    formatArguments(checkerStack: Array<RiscToken>, state: RiscSyntaxState, action: SyntaxTableEntry): void {
        if ( !action.number ) { return; }
        switch ( state ) {
            case RiscSyntaxState.IMM_LOAD_NUM: {
                const token = checkerStack.at(-action.number);
                this.formatRegister( token ? token : BASE_RISC_TOKEN, [ RegisterFormat.COMMA ]);
                break;
            }

            case RiscSyntaxState.TWO_REG_SECOND_REG:
            case RiscSyntaxState.THREE_REG_THIRD_REG: {
                for (let i = action.number; i > 1; i--) {
                    const token = checkerStack.at(-i);
                    this.formatRegister(token ? token : BASE_RISC_TOKEN, [ RegisterFormat.COMMA ]);
                }
                const token = checkerStack.at(-1);
                this.formatRegister(token ? token : BASE_RISC_TOKEN, []);
                break;
            }

            case RiscSyntaxState.STORE_SECOND_REG: {
                const token = checkerStack.at(-action.number);
                this.formatRegister(token ? token : BASE_RISC_TOKEN, [ RegisterFormat.PARANTHESE, RegisterFormat.COMMA ]);
                const endRegister = checkerStack.at(-1);
                this.formatRegister(endRegister ? endRegister : BASE_RISC_TOKEN, []);
                break;
            }

            case RiscSyntaxState.LOAD_SECOND_REG: {
                const firstToken = checkerStack.at(-action.number);
                this.formatRegister(firstToken ? firstToken : BASE_RISC_TOKEN, [ RegisterFormat.COMMA ]);
                const endRegister = checkerStack.at(-1);
                this.formatRegister( endRegister ? endRegister : BASE_RISC_TOKEN, [ RegisterFormat.PARANTHESE ]);
                break;
            }
        }
    }

    formatRegister(token: RiscToken, format: Array<RegisterFormat>): void {
        if ( token.type !== RiscTokenType.REGISTER ) { return; }
        const regexMatch = token.value.match(SIMPLE_REGISTER_POLYRISC);
        if ( !regexMatch ) { return; }
        let value = regexMatch[0];
        format.forEach(e => {
            if ( e === RegisterFormat.PARANTHESE ) {
                value = "(" + value + ")";
            }

            if ( e === RegisterFormat.COMMA ) {
                value += ",";
            }
        });

        token.value = value;
    }
}
