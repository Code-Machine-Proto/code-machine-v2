import { DEFAULT_SNACK_BAR } from "@src/constants/SnackBar";
import type { SnackBarDispatch, SnackBarInterface } from "@src/interface/SnackBarInterface";
import { createContext, useState, type ReactNode } from "react";

export const SnackBarContext = createContext<SnackBarDispatch>(() => {});

export function SnackBarProvider({ children }: { children: ReactNode }) {
    const [snackBar, setSnackBar] = useState<SnackBarInterface>(DEFAULT_SNACK_BAR);
    return (
        <>
            <SnackBarContext.Provider value={setSnackBar}>
                {children}
            </SnackBarContext.Provider>
        </>
    );
}