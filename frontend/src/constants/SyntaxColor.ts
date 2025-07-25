import { TokenType } from "@src/interface/visitor/Token";

/**
 * Record de toutes les différentes couleurs que prenne les jetons
 */
export const SYNTAX_COLOR: Record<TokenType, string> = {
    [TokenType.NUMBER]: "text-white",
    [TokenType.BLANK]: "text-white",
    [TokenType.COMMENT]: "text-comment",
    [TokenType.LABEL]: "text-label",
    [TokenType.TEXT_LABEL]: "text-white",
    [TokenType.DATA_LABEL]: "text-white",
    [TokenType.OPERATION]: "text-inst",
    [TokenType.WORD]: "text-white",
    [TokenType.REGISTER]: "text-register",
};
