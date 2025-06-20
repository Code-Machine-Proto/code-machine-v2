import type { Dispatch, SetStateAction } from "react";

export interface HexSwitcherProps {
    isBase10: boolean,
    setIsBase10: Dispatch<SetStateAction<boolean>>,
    name?: string,
}