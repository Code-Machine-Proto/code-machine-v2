import type Processor from "@src/class/Processor";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { compileAndRun } from "@src/module-http/http";
import { type ClientActionFunctionArgs } from "react-router";

/**
 * Reçoit et envoie vers la compilation le code
 * @prop request - requête pour envoyer le programme
 * @returns le données provenant de la compilation 
 */
export async function clientAction({ request }: ClientActionFunctionArgs): Promise<{ result: Array<ProcessorStep>, error?: string }> {
    const data = await request.formData();
    const processor: Processor = JSON.parse(data.get("processor") as string);
    let output;
    let error;
    try {
        output = (await compileAndRun({ processorId: processor.processorId, program: processor.cleanCode })).output;
    } catch (err){
        error = `Erreur du serveur: ${(err as Error).message}\nVeuillez redémarrer CodeMachine!`;
        output = "[,]";
    }
    /* eslint-disable no-magic-numbers */
    output = output.slice(0, -2) + output.slice(-1);
    /* eslint-enable no-magic-numbers */
    return { result: JSON.parse(output), error: error };
}

/**
 * Composant vide
 * @returns Composant à afficher
 */
export default function CompileAction(){
    return(<></>);
}
