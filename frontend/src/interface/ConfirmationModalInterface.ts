import type { Dispatch, SetStateAction } from "react";

export interface ConfirmationModalInterface {
    message: string,
    visible: boolean,
}

export type DispatchModal = Dispatch<SetStateAction<ConfirmationModalInterface>>;