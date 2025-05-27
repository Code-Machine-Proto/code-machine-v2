import CodeEditor from "@src/components/code/CodeEditor";
import { CodeProvider } from "@src/components/code/CodeProvider";
import ExecutionControl from "@src/components/execution/ExecutionControl";
import { Outlet } from "react-router";

/**
 * Layout de la page processeurs pour accueillir une simulation d'un processeur 
 * @returns Le composant de la page des processeur
 */
export default function Processor() {
    return (
        <CodeProvider >
                <div className="flex grow p-5 bg-back gap-5">
                    <CodeEditor />
                    <div className="flex flex-col grow bg-main-950 rounded-xl p-5 gap-5">
                        <ExecutionControl />
                        <Outlet />
                    </div>
                </div>
        </CodeProvider>
    );
}
