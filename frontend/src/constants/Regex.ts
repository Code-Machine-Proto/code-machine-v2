export const WHITESPACE_REGEX = /\s+/g;

export const COMMENT_REGEX = /^(#|\/\/).*$/;

export const WORD_REGEX = /^[a-z]+$/;

export const LABEL_REGEX = /^[a-z]+:$/;

export const OPERATION_REGEX_ACC = /^(add|sub|mul|ld|st(op)?|brz?(nz)?|nop)$/;

export const OPERATION_REGEX_MA =  /^((add|sub)(a|x)?|mul|(ld|st)(a|i)?|sh(l|r)|brz?(nz?)|stop|nop)$/;

export const NUMBER_REGEX = /^-?([1-9][0-9]+|[0-9])$/;

export const MAIN_LABEL_REGEX = /^\.(text|data)$/;