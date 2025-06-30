import type { ProcessorId } from "@src/interface/CodeInterface";
import { getCode } from "@src/module-store/CodeStore";

/**
 * Classe représentant l'état d'un processeur quelquonque
 */
export default abstract class Processor {
    code: string;
    lines: Array<string>;
    processorId: number;
    abstract defaultCode: string;

    constructor(id: ProcessorId) {
        this.processorId = id;
        this.code = this.getSavedCode();
        this.lines = this.splitLines();
    }

    splitLines(): Array<string> {
        return this.code.split("\n");
    }

    getSavedCode(): string {
        let code = getCode(this.processorId);
        if ( !code ) {
            code = this.defaultCode;
        }
        return code;
    }
}
