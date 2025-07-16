import type Processor from "@src/class/Processor";
import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { compileAndRun } from "@src/module-http/http";
import type { ClientActionFunctionArgs } from "react-router";

/**
 * Reçoit et envoie vers la compilation le code
 * @prop request - requête pour envoyer le programme
 * @returns le données provenant de la compilation 
 */
export async function clientAction({ request }: ClientActionFunctionArgs): Promise<Array<ProcessorStep>> {
    const data = await request.formData();
    const processor: Processor = JSON.parse(data.get("processor") as string);
    let { output } = await compileAndRun({ processorId: processor.processorId, program: processor.code.split("\n") }) as { hex: Array<string>, output: string };
    /* eslint-disable no-magic-numbers */
    output = output.slice(0, -2) + output.slice(-1);
    /* eslint-enable no-magic-numbers */
    return JSON.parse(output);
}

/**
 * Composant vide
 * @returns Composant à afficher
 */
export default function CompileAction(){
    return(<></>);
}
