import type { CompilePayload } from "./CompileInterface";

const API_URL = "http://localhost:8080";

export async function compileAndRun(compilePayload: CompilePayload): Promise<any> {
    const res = await fetch(`${API_URL}/compileAndRun`, {
        method: "POST",
        body: JSON.stringify(compilePayload),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.json();
}