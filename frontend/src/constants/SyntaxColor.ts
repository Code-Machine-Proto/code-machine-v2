import type { TokenType } from "@src/interface/visitor/Token";
import { TokenType as Token } from "@src/interface/visitor/Token";

export const SYNTAX_COLOR: Record<TokenType, string> = {
    [Token.NUMBER]: "text-white",
    [Token.BLANK]: "text-white",
    [Token.COMMENT]: "text-comment",
    [Token.LABEL]: "text-label",
    [Token.MAIN_LABEL]: "text-white",
    [Token.OPERATION]: "text-inst",
    [Token.WORD]: "text-white",
    [Token.REGISTER]: "text-register",
};