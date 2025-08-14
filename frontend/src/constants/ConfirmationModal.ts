import type { ConfirmationModalInterface } from "@src/interface/ConfirmationModalInterface";
import { CodeAction } from "@src/interface/DispatchCode";

export const DEFAULT_CONFIRMATION_MODAL: ConfirmationModalInterface = {
    message: "Message par défaut pour les tests doient être enlever avant la release",
    visible: false,
    payload: {
        type: CodeAction.RESET_CODE,
    },
};

export const DELETE_CODE_MESSAGE = "";