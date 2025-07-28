import { DEFAULT_EXECUTION_STATE } from "@src/constants/CodeProvider";
import type { ProcessorId } from "@src/interface/CodeInterface";
import type { HighlightedLine } from "@src/interface/HighlightedLines";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { PlayerMode } from "@src/interface/StepControl";
import type { Token } from "@src/interface/visitor/Token";
import type { Visitor } from "@src/interface/visitor/VisitorInterface";
import { getCode } from "@src/module-store/CodeStore";

/**
 * Classe représentant l'état d'un processeur quelquonque
 */
export default abstract class Processor {

    /**
     * Code source
     */
    code: string;

    /**
     * L'identifiant du processeur
     */
    processorId: number;

    /**
     * Les étapes possibles d'afficher
     */
    steps: Array<ProcessorStep>;

    /**
     * Numéro de l'étape courante
     */
    count: number;

    /**
     * Si le défilement automatique est activé ou non
     */
    isPlaying: boolean;

    /**
     * Si le processeur est en mode exécution ou en mode régulier
     */
    mode: PlayerMode;

    /**
     * Code source augmenté de la mise en évidence
     */
    highlightedText: Array<HighlightedLine>;

    /**
     * Jeton représentant le code source
     */
    tokenizedLines: Array<Array<Token>>;

    isCompilable: boolean;

    cleanCode: Array<string>;

    constructor(id: ProcessorId) {
        this.processorId = id;
        this.code = this.getSavedCode();
        this.steps = DEFAULT_EXECUTION_STATE;
        this.count = 0;
        this.isPlaying = false;
        this.mode = PlayerMode.regular;
        this.tokenizedLines = [];
        this.highlightedText = [];
        this.isCompilable = false;
        this.cleanCode = [];
    }

    /**
     * Le code source séparé en ligne
     */
    get lines(): Array<string> {
        return this.code.split("\n");
    }

    /**
     * Permets d'obtenir le code utilisé en ce moment
     */
    getSavedCode(): string {
        let code = getCode(this.processorId);
        if ( !code ) {
            code = "";
        }
        return code;
    }

    /**
     * Étape présentement affiché par le processeur
     */
    get currentStep(): ProcessorStep {
        return this.steps[this.count];
    }

    /**
     * Permets au processeur de copier les éléments communs à tous les processeurs
     */
    internalClone(processor: Processor): Processor {
        processor.code = this.code;
        processor.steps = this.steps;
        processor.count = this.count;
        processor.isPlaying = this.isPlaying;
        processor.mode = this.mode;
        processor.highlightedText = this.highlightedText;
        processor.tokenizedLines = this.tokenizedLines;
        processor.isCompilable = this.isCompilable;
        processor.cleanCode = this.cleanCode;
        return processor;
    }

    /**
     * Permets au processeur de créer une copie de soi-même
     */
    abstract clone(): Processor;

    /**
     * Permets au visiteur d'identifier le bon type de processeur
     */
    abstract accept(visitor: Visitor): void;
}
