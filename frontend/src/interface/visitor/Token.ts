export enum TokenType {
    NUMBER,
    WORD,
    LABEL,
    OPERATION,
    COMMENT,
    MAIN_LABEL,
    BLANK,
}

export interface Token {
    value: string,
    type: TokenType,
}