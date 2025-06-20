import type { MouseEventHandler, ReactNode } from "react";

export interface ExecutionButtonProps {
    children: ReactNode,
    onClick: MouseEventHandler<HTMLButtonElement>,
}