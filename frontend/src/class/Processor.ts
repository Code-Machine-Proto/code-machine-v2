import { DEFAULT_EXECUTION_STATE } from "@src/constants/CodeProvider";
import type { ProcessorId } from "@src/interface/CodeInterface";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { PlayerMode } from "@src/interface/StepControl";
import { getCode } from "@src/module-store/CodeStore";

/**
 * Classe représentant l'état d'un processeur quelquonque
 */
export default abstract class Processor {
    code: string;
    lines: Array<string>;
    processorId: number;
    steps: Array<ProcessorStep>;
    count: number;
    isPlaying: boolean;
    mode: PlayerMode;

    constructor(id: ProcessorId) {
        this.processorId = id;
        this.code = this.getSavedCode();
        this.lines = this.splitLines();
        this.steps = DEFAULT_EXECUTION_STATE;
        this.count = 0;
        this.isPlaying = false;
        this.mode = PlayerMode.regular;
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

    get currentStep(): ProcessorStep {
        return this.steps[this.count];
    }

    clone(processor: Processor): Processor {
        processor.code = this.code;
        processor.lines = this.lines;
        processor.steps = this.steps;
        processor.count = this.count;
        processor.isPlaying = this.isPlaying;
        processor.mode = this.mode;
        return processor;
    }
}
