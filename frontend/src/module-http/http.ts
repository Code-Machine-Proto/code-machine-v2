import type { CompilePayload, CompileResult } from "./CompileInterface";

const API_URL = "http://localhost:8080";

/**
 * Permets d'envoyer le code au serveur pour effectuer sa compilation
 * @param compilePayload donnée à envoyer
 * @returns les données provenant du serveur
 */
export async function compileAndRun(compilePayload: CompilePayload): Promise<CompileResult> {
    const res = await fetch(`${API_URL}/compileAndRun`, {
        method: "POST",
        body: JSON.stringify(compilePayload),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.json();
}
