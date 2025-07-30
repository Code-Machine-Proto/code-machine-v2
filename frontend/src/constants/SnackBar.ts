import { type SnackBarInterface } from "@src/interface/SnackBarInterface";

export enum MessageType {
    NEUTRAL,
    ERROR,
    VALID,
}

export const DEFAULT_SNACK_BAR: SnackBarInterface = { visible: false, message: "", type: MessageType.NEUTRAL, duration: Infinity };
