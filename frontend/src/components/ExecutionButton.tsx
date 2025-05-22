import type { ReactNode } from "react"

export default function ExecutionButton({ children }: { children: ReactNode }) {
    return (
        <button className="controlBtn size-[3rem] hover:bg-main-900">
            <svg fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" className="size-[2rem]">
                { children }
            </svg>
            </button>
    )
}