import CodeEditor from "@src/components/CodeEditor";
import { CodeProvider } from "@src/components/CodeProvider";

export default function Processor() {
    return (
        <CodeProvider >
                <div className="flex grow p-5 bg-back">
                    <CodeEditor />
                </div>
        </CodeProvider>
    );
}