import CodeEditor from "@src/components/CodeEditor";

export default function Processor() {
    return (
        <div className="flex flex-col grow bg-back">
            <div className="flex">
                <CodeEditor />
            </div>
        </div>
    );
}