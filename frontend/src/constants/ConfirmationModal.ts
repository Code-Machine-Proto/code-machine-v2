import type { ConfirmationModalInterface } from "@src/interface/ConfirmationModalInterface";
import { CodeAction } from "@src/interface/DispatchCode";

export const DEFAULT_CONFIRMATION_MODAL: ConfirmationModalInterface = {
    message: "Message par défaut pour les tests doient être enlever avant la release",
    visible: false,
    payload: {
        type: CodeAction.RESET_CODE,
    },
};

export const DELETE_CODE_MESSAGE = "Cette action va enlever le code de l'éditeur de texte et est irréversible. Êtes vous bien sur de vouloir procéder";

export const UPLOAD_CODE_MESSAGE = "Cette action va remplacer le code actuel de l'éditeur de texte par le contenu du fichier importé et est irréversible. Êtes vous bien sur de vouloir procéder";