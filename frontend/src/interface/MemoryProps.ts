import type { ReactNode } from "react";

export interface MemoryProps {
    memoryContent: Array<number>,
    className: string,
    stimulatedCell?: number,
    nom: string,
}
