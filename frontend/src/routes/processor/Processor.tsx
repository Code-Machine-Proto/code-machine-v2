import CodeEditor from "@src/components/CodeEditor";
import { CodeProvider } from "@src/components/CodeProvider";
import ExecutionControl from "@src/components/ExecutionControl";

/**
 * Layout de la page processeurs pour accueillir une simulation d'un processeur 
 * @returns Le composant de la page des processeur
 */
export default function Processor() {
    return (
        <CodeProvider >
                <div className="flex grow p-5 bg-back gap-5">
                    <CodeEditor />
                    <div className="flex flex-col grow bg-main-950 rounded-xl p-5">
                        <ExecutionControl />
                    </div>
                </div>
        </CodeProvider>
    );
}
