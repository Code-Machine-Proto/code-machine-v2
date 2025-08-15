import type { Dispatch, SetStateAction } from "react";
import type { CodePayload } from "./DispatchCode";

export interface ConfirmationModalInterface {
    message: string,
    visible: boolean,
    payload: CodePayload,
}

export type DispatchModal = Dispatch<SetStateAction<ConfirmationModalInterface>>;