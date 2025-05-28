export default function Memory({ memoryContent }: { memoryContent: Array<number>}) {
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="flex flex-col text-white bg-slate-800 p-3 rounded-md">
                    <p className="text-xs text-main-400">Mode</p>
                    <select className="bg-slate-800 outline-none">
                        <option>1</option>
                        <option>2</option>
                        <option>4</option>
                        <option>8</option>
                    </select>
                </div>
            </div>
            <div className={`grid grid-cols-${1} max-h-[20rem] size-fit overflow-scroll no-scrollbar gap-1`}>
            { 
                memoryContent.map((value, index) => {
                    return (
                    <div className="flex flex-col h-[3rem] w-[5rem] bg-slate-700 justify-center p-2 rounded-sm">
                        <p key={index} className="text-white text-right">
                            { value }
                        </p>
                    </div>
                    );
                })
            }
                </div>
        </div>
    );
}