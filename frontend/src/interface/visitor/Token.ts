/**
 * Type que peut prendre un jeton
 */
export enum TokenType {
    NUMBER = "number",
    WORD = "word",
    LABEL = "label",
    OPERATION = "operation",
    COMMENT = "comment",
    TEXT_LABEL = "text-label",
    DATA_LABEL = "data-label",
    BLANK = "blank",
    REGISTER = "register",
}

/**
 * Interface d'un jeton simple
 */
export interface Token {
    value: string,
    type: TokenType,
    error?: string,
    warning?: string,
}

export interface ComposedToken {
    value: string,
    type: ComposedTokenType,
    error?: string,
    warning?: string,
}

export enum ComposedTokenType {
    PROGRAM = "program",
    PROGRAM_DATA = "program-data",
    INSTRUCTION = "instruction",
    TEXT = "text",
    STATEMENT = "statement",
    TEXT_BLOCK = "text-block",
    DATA = "data",
    DATA_BLOCK = "data-block",
    END_OF_CODE = "end-of-code",
}