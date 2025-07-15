/**
 * Type que peut prendre un jeton
 */
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

/**
 * Interface d'un jeton simple
 */
export interface Token {
    value: string,
    type: TokenType,
}
