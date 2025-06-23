import type { Dispatch, SetStateAction } from "react";

/**
 * Paramètre pour un interupteur hexadécimal et décimal
 */
export interface HexSwitcherProps {
    isBase10: boolean,
    setIsBase10: Dispatch<SetStateAction<boolean>>,
    name?: string,
}
