import type { MessageType } from "@src/constants/SnackBar";
import type { Dispatch, SetStateAction } from "react";

export interface SnackBarInterface {
    visible: boolean,
    message: string,
    type: MessageType,
}

export type SnackBarDispatch = Dispatch<SetStateAction<SnackBarInterface>>;

