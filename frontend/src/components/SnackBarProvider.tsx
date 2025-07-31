import { DEFAULT_SNACK_BAR, MessageType } from "@src/constants/SnackBar";
import type { SnackBarDispatch, SnackBarInterface } from "@src/interface/SnackBarInterface";
import { createContext, useEffect, useState, type ReactNode } from "react";
import valid from "@src/assets/valid.svg";
import notValid from "@src/assets/not-valid.svg";

export const SnackBarContext = createContext<SnackBarDispatch>(() => {});

export function SnackBarProvider({ children }: { children: ReactNode }) {
    const [snackBar, setSnackBar] = useState<SnackBarInterface>(DEFAULT_SNACK_BAR);
    useEffect(() => {
        if (snackBar.visible && !isDurationInfinite(snackBar.duration)) {
            const timer = setTimeout(() => {
                setSnackBar(previous => {
                    return { ...previous, visible: false };
                });
            }, snackBar.duration);
            return () => clearTimeout(timer);
        }
    }, [snackBar]);
    return (
        <>
                <div className={
                    `absolute flex items-center bottom-0 left-1/2 h-[5rem] w-[50rem]
                    my-2 py-2 px-4 rounded-md transform -translate-x-1/2 gap-5 ${backgroundColor(snackBar.type)}
                    transition-all duration-500 ease-in-out ${snackBar.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`
                }>
                    {
                        !isNeutral(snackBar.type) &&
                        <img src={isError(snackBar.type) ? notValid : valid} alt="check-logo" className="size-[3rem]" />
                    }
                    <p className="text-white w-full whitespace-pre-line overflow-y-scroll overflow-x-hiden h-full">{snackBar.message}</p>
                {
                    isDurationInfinite(snackBar.duration) &&
                    <button
                        className="text-white font-bold text-lg cursor-pointer"
                        onClick={() => setSnackBar(previous => {
                            return { ...previous, visible: false };
                        })}
                    >
                        x
                    </button>
                }
                </div>
            <SnackBarContext.Provider value={setSnackBar}>
                {children}
            </SnackBarContext.Provider>
        </>
    );
}

function isError(type: MessageType): boolean {
    return type === MessageType.ERROR;
}

function isNeutral(type: MessageType): boolean {
    return type === MessageType.NEUTRAL;
}

function backgroundColor(type: MessageType): string {
    switch (type) {
        case MessageType.NEUTRAL: return "bg-main-800";
        case MessageType.ERROR: return "bg-red-500";
        case MessageType.VALID: return "bg-green-600";
    }
}

function isDurationInfinite(duration: number): boolean {
    return duration === Infinity;
}