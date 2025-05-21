import CodeEditor from "@src/components/CodeEditor";
import { CodeProvider } from "@src/components/CodeProvider";

export default function Processor() {
    return (
        <CodeProvider >
            <div className="flex flex-col grow bg-back">
                <div className="flex">
                    <CodeEditor />
                </div>
            </div>
        </CodeProvider>
    );
}