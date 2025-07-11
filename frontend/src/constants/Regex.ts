export const WHITESPACE_REGEX = /\s+/g;

export const COMMENT_REGEX = /^(#|\/\/).*$/;

export const WORD_REGEX = /^[a-z]+$/;

export const LABEL_REGEX = /^[a-z]+:$/;

export const OPERATION_REGEX_ACC = /^(add|sub|mul|ld|st(op)?|br(z|nz)?|nop)$/;

export const OPERATION_REGEX_MA =  /^((add|sub)(a|x)?|mul|(ld|st)(a|i)?|sh(l|r)|br(z|nz)?|(st|n)op)$/;

export const NUMBER_REGEX = /^-?([1-9][0-9]+|[0-9])$/;

export const MAIN_LABEL_REGEX = /^\.(text|data)$/;

export const OPERATION_REGEX_POLYRISC = /^(add|sub|sh(r|l)|not|and|or|mv|br(z|nz|lz|gez)?|ldi?|st(op)?|nop)$/;

export const REGISTER_POLYRISC = /^\(?r([0-9]|[1-2][0-9]|3[1-2])\)?,?$/;