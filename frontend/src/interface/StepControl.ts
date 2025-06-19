export interface StepControl {
    count: number,
    isPlaying: boolean,
    mode: PlayerMode,
}

export enum PlayerMode {
    regular = "regular",
    execution = "execution",
}