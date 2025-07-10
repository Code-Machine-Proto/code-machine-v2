import type { TokenType } from "@src/interface/visitor/Token";
import { TokenType as Token } from "@src/interface/visitor/Token";

export const COLOR_ACC: Record<TokenType, string> = {
    [Token.NUMBER]: "text-white",
    [Token.BLANK]: "text-white",
    [Token.COMMENT]: ""
};