import type { Dispatch, SetStateAction } from "react";

export type booleanState = [ boolean, Dispatch<SetStateAction<boolean>>];

export interface ExecutionControlProps {
    memoryState: booleanState,
    visualSetting: booleanState,
}