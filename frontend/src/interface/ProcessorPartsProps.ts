import type { ReactNode } from "react";

export interface Coordinates {
    x: number,
    y: number,
}

export interface ObscureMemoryProps extends Coordinates {
    children?: ReactNode,
    name: string,
    controlName: string,
    className: string,
    isWritable?: boolean,
    hasControlSignal?: boolean,
}

export interface AluProps extends Coordinates {
    hasNz?: boolean,
    isNzActivated?: boolean,
    isOpActivated?: boolean,
}

export interface RegisterBoxProps extends Coordinates {
    name: string,
    number: number,
    className: string,
}

export interface MultiplexerProps extends Coordinates {
    isActivated?: boolean,
    name: string,
}