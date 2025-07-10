export const WHITESPACE_REGEX = /\s+/g;

export const COMMENT_REGEX = /^(#|\/\/).*$/g;

export const WORD_REGEX = /^[a-z]+$/g;

export const LABEL_REGEX = /^[a-z]+:$/g;

export const OPERATION_REGEX_ACC = /^add|sub|mul|ld|st(op)?|brz?(nz)?|nop$/g;

export const NUMBER_REGEX = /^-?[1-9][0-9]+|[0-9]$/g;

export const MAIN_LABEL_REGEX = /^\.(text|data)$/g;