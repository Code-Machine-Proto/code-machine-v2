import { DEFAULT_CONFIRMATION_MODAL } from "@src/constants/ConfirmationModal";
import { type DispatchModal, type ConfirmationModalInterface } from "@src/interface/ConfirmationModalInterface";
import { type ReactNode, createContext, useState } from "react";

export const ConfirmationModalContext = createContext<DispatchModal>(() => {});
export function ConfirmationModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ConfirmationModalInterface>(DEFAULT_CONFIRMATION_MODAL);
    return (
        <ConfirmationModalContext.Provider value={setModal}>
            {children}
        </ConfirmationModalContext.Provider>
    );
}