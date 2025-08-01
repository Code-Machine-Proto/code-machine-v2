import type { ReactNode } from "react";

/**
 * Coordonnée en deux dimensions
 */
export interface Coordinates {
    x: number,
    y: number,
}

/**
 * Paramètre des mémoires non-détaillées
 */
export interface ObscureMemoryProps extends Coordinates {
    children?: ReactNode,
    name: string,
    controlName?: string,
    className: string,
    isWritable?: boolean,
    hasControlSignal?: boolean,
}

/**
 * Paramètres de la représentation de l'Alu
 */
export interface AluProps extends Coordinates {
    hasNz?: boolean,
    isActivated?: boolean,
}

/**
 * Paramètres de la représentation des registres uniques non-addressables
 */
export interface RegisterBoxProps extends Coordinates {
    name: string,
    number: number,
    className: string,
    defaultIsBase10?: boolean,
    isActivated: boolean,
    registerSize?: number,
}

/**
 * Paramètres des multiplexeurs
 */
export interface MultiplexerProps extends Coordinates {
    isActivated?: boolean,
    name: string,
}

/**
 * Paramètres des bus
 */
export interface BusProps extends Coordinates {
    number: number,
}
