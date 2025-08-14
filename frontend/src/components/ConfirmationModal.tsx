import { DEFAULT_CONFIRMATION_MODAL } from "@src/constants/ConfirmationModal";
import { type DispatchModal, type ConfirmationModalInterface } from "@src/interface/ConfirmationModalInterface";
import { type ReactNode, createContext, useContext, useState } from "react";
import { DispatchProcessorContext } from "./code/CodeProvider";
import { CodeAction } from "@src/interface/DispatchCode";

export const ConfirmationModalContext = createContext<DispatchModal>(() => {});
export function ConfirmationModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ConfirmationModalInterface>(DEFAULT_CONFIRMATION_MODAL);
    const dispatch = useContext(DispatchProcessorContext);
    return (
        <>
            <div
                className={`absolute left-1/2 top-1/2 transform -translate-x-1/2
                -translate-y-1/2 max-h-[20rem] max-w-[30rem] bg-white rounded-4xl
                shadow-xl shadow-main-900 p-5 flex flex-col gap-2
                transition-all duration-500 ease-in-out ${
                    modal.visible ? "opacity-100" : "opacity-0 pointer-events-none"
                } z-20`}
            >
                <p className="text-xl font-bold text-red-500">Avertissement!</p>
                <p>{modal.message}</p>
                <div className="flex flex-row-reverse gap-2">
                    <button
                        className="p-2 border-2 text-red-500 border-red-500 rounded-md cursor-pointer hover:bg-red-200"
                        onClick={() => {
                            dispatch(modal.payload);
                            dispatch({ type: CodeAction.RESET_CODE });
                            setModal(previous => {
                                return { ...previous, visible: false };
                            });
                        }}
                    >
                        Confirmer
                    </button>
                    <button 
                        className="p-2 border-2 text-main-400 border-main-400 rounded-md cursor-pointer hover:bg-main-200"
                        onClick={() => setModal(previous => {
                            return { ...previous, visible: false };
                        })}
                    >
                        Annuler
                    </button>
                </div>
            </div>
            <div
                className={`absolute z-10 size-full bg-main-200
                transition-all duration-500 ease-in-out
                ${ modal.visible ? "opacity-20" : "opacity-0 pointer-events-none"}`}
            />
            <ConfirmationModalContext.Provider value={setModal}>
                    {children}
            </ConfirmationModalContext.Provider>
        </>
    );
}