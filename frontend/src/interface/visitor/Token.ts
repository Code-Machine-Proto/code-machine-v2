export enum TokenType {
    NUMBER,
    WORD,
    LABEL,
    OPERATION,
    COMMENT,
    MAIN_LABEL,
    BLANK,
    REGISTER,
}

export interface Token {
    value: string,
    type: TokenType,
}