import HexNumber from "@src/components/utils-hex/HexNumber";
import HexSwitcher from "@src/components/utils-hex/HexSwitcher";
import { useState } from "react";

export default function RegisterBox({name, number, className}: { name: string, number: number, className?: string }) {
    const [isBase10, setIsBase10] = useState<boolean>(true);

    return(
        <div className={ `flex flex-col h-22 w-[10rem] rounded-sm ${className}` } >
            <div className="flex px-2 pt-1 justify-between">
                <p>{ name }</p>
                <HexSwitcher isBase10={isBase10} setIsBase10={setIsBase10} />
            </div>
            <HexNumber number={number} className="px-2" isBase10={isBase10} />
            <p className="text-xl">{ ">" }</p>
        </div>
    );
} 