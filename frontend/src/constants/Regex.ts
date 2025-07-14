/**
 * Regex pour séparer les mots
 */
export const WHITESPACE_REGEX = /\s+/g;

/**
 * Regex pour identifier un commentaire
 */
export const COMMENT_REGEX = /^(#|\/\/).*$/;

/**
 * Regex pour identifier un mot de lettre
 */
export const WORD_REGEX = /^[a-z]+$/;

/**
 * Regex pour identifier une étiquette
 */
export const LABEL_REGEX = /^[a-z]+:$/;

/**
 * Regex pour détecter les opérations du processeur à accumulateur
 */
export const OPERATION_REGEX_ACC = /^(add|sub|mul|ld|st(op)?|br(z|nz)?|nop)$/;

/**
 * Regex pour détecter les opérations du processeur à accumulateur avec MA
 */
export const OPERATION_REGEX_MA =  /^((add|sub)(a|x)?|mul|(ld|st)(a|i)?|sh(l|r)|br(z|nz)?|(st|n)op)$/;

/**
 * Regex pour identifier un nombre
 */
export const NUMBER_REGEX = /^-?([1-9][0-9]+|[0-9])$/;

/**
 * Regex pour identifier le .text ou le .data
 */
export const MAIN_LABEL_REGEX = /^\.(text|data)$/;

/**
 * Regex pour identifier les opérations du processeur PolyRisc
 */
export const OPERATION_REGEX_POLYRISC = /^(add|sub|sh(r|l)|not|and|or|mv|br(z|nz|lz|gez)?|ldi?|st(op)?|nop)$/;

/**
 * Regex pour identifier les registres utilisé dans les opérations du PolyRisc
 */
export const REGISTER_POLYRISC = /^\(?r([0-9]|[1-2][0-9]|3[1-2])\)?,?$/;
