import CodeEditor from "@src/components/code/CodeEditor";
import { CodeProvider } from "@src/components/code/CodeProvider";
import ExecutionControl from "@src/components/execution/ExecutionControl";
import Memory from "@src/components/Memory";
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
                        <div className=" flex grow gap-5">
                            <Outlet />
                            <Memory memoryContent={[0,1,2,3,4,5,6,7,8,9,10,11,12,13]}/>
                        </div>
                    </div>
                </div>
        </CodeProvider>
    );
}
