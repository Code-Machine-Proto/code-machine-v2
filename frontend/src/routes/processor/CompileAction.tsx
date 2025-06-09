import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { compileAndRun } from "@src/module-http/http";
import type { ClientActionFunctionArgs } from "react-router";

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<Array<ProcessorStep>> {
    const data = await request.formData();
    const lines = JSON.parse(data.get("lines") as string);
    const processorId = parseInt(data.get("processorId") as string);
    let { output } = await compileAndRun({ processorId: processorId, program: lines }) as { hex: Array<string>, output: string };
    /* eslint-disable no-magic-numbers */
    output = output.slice(0, -2) + output.slice(-1);
    /* eslint-enable no-magic-numbers */
    return JSON.parse(output);
}

export default function CompileAction(){
    return(<></>);
}