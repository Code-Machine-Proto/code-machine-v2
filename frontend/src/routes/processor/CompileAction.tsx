import type { ProcessorStep } from "@src/interface/ProcessorStep";
import { compileAndRun } from "@src/module-http/http";
import type { ClientActionFunctionArgs } from "react-router";

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<Array<ProcessorStep>> {
    const data = await request.formData();
    const lines = data.get("lines") as string;
    const processorId = parseInt(data.get("processorId") as string);
    console.log(processorId);

    let { output } = await compileAndRun({ processorId: processorId, userId: 111111, program: lines.split(",") }) as { hex: Array<string>, output: string };
    output = output.slice(0, -2) + output.slice(-1);

    return JSON.parse(output);
}

export default function CompileAction(){
    return(<></>);
}