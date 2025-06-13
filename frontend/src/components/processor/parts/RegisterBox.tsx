import HexNumber from "@src/components/utils-hex/HexNumber";
import HexSwitcher from "@src/components/utils-hex/HexSwitcher";
import type { RegisterBoxProps } from "@src/interface/ProcessorPartsProps";
import { useState } from "react";

export default function RegisterBox({name, number, className, x, y}: RegisterBoxProps) {
    const [isBase10, setIsBase10] = useState<boolean>(true);

    return(
        <foreignObject x={x} y={y} width={120} height={65}>
            <div className={ `flex flex-col rounded-sm ${className}` } >
                <div className="flex px-2 pt-1 justify-between">
                    <p>{ name }</p>
                    <HexSwitcher isBase10={isBase10} setIsBase10={setIsBase10} />
                </div>
                <div className="flex justify-between">
                    <p className="text-xl">{ ">" }</p>
                    <HexNumber number={number} className="px-2" isBase10={isBase10} />
                </div>
            </div>
        </foreignObject>
    );
} 