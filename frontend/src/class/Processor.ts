import { DEFAULT_EXECUTION_STATE } from "@src/constants/CodeProvider";
import type { ProcessorId } from "@src/interface/CodeInterface";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { getCode } from "@src/module-store/CodeStore";

/**
 * Classe représentant l'état d'un processeur quelquonque
 */
export default abstract class Processor {
    code: string;
    lines: Array<string>;
    processorId: number;
    executedCode?: Array<ProcessorStep>;

    constructor(id: ProcessorId) {
        this.processorId = id;
        this.code = this.getSavedCode();
        this.lines = this.splitLines();
        this.executedCode = DEFAULT_EXECUTION_STATE;
    }

    splitLines(): Array<string> {
        return this.code.split("\n");
    }

    getSavedCode(): string {
        let code = getCode(this.processorId);
        if ( !code ) {
            code = "";
        }
        return code;
    }

    abstract clone(): Processor;

    get steps(): Array<ProcessorStep> {
        return this.executedCode ? this.executedCode : DEFAULT_EXECUTION_STATE;
    }
}
