use crate::types::{TokenKind, TokenSpan};

/// A parsed token from a single line of assembly.
#[derive(Debug, Clone)]
pub enum Token {
    Directive(String),
    LabelDef(String),
    Mnemonic(String),
    Number(i32),
    Identifier(String),
    Comma,
    Plus,
    Comment(String),
}

/// Tokenize a single line of assembly, returning both structured tokens and token spans for IDE use.
pub fn tokenize_line(line: &str, line_index: usize) -> (Vec<Token>, Vec<TokenSpan>) {
    let mut tokens = Vec::new();
    let mut spans = Vec::new();
    let mut chars = line.char_indices().peekable();

    while let Some(&(i, c)) = chars.peek() {
        // Skip whitespace
        if c.is_whitespace() {
            chars.next();
            continue;
        }

        // Comment
        if c == ';' || c == '#' {
            let comment: String = chars.by_ref().map(|(_, ch)| ch).collect();
            spans.push(TokenSpan {
                line: line_index,
                start: i,
                end: line.len(),
                kind: TokenKind::Comment,
            });
            tokens.push(Token::Comment(comment));
            break;
        }

        // Comma
        if c == ',' {
            chars.next();
            spans.push(TokenSpan {
                line: line_index,
                start: i,
                end: i + 1,
                kind: TokenKind::Punctuation,
            });
            tokens.push(Token::Comma);
            continue;
        }

        // Plus
        if c == '+' {
            chars.next();
            spans.push(TokenSpan {
                line: line_index,
                start: i,
                end: i + 1,
                kind: TokenKind::Punctuation,
            });
            tokens.push(Token::Plus);
            continue;
        }

        // Directive
        if c == '.' {
            let start = i;
            chars.next();
            let mut word = String::from(".");
            while let Some(&(_, ch)) = chars.peek() {
                if ch.is_alphanumeric() || ch == '_' {
                    word.push(ch);
                    chars.next();
                } else {
                    break;
                }
            }
            spans.push(TokenSpan {
                line: line_index,
                start,
                end: start + word.len(),
                kind: TokenKind::Directive,
            });
            tokens.push(Token::Directive(word));
            continue;
        }

        // Number (decimal or negative)
        if c.is_ascii_digit() || (c == '-' && chars.clone().nth(1).is_some_and(|(_, ch)| ch.is_ascii_digit())) {
            let start = i;
            let mut num_str = String::new();
            if c == '-' {
                num_str.push('-');
                chars.next();
            }
            while let Some(&(_, ch)) = chars.peek() {
                if ch.is_ascii_digit() {
                    num_str.push(ch);
                    chars.next();
                } else {
                    break;
                }
            }
            let end = start + num_str.len();
            spans.push(TokenSpan {
                line: line_index,
                start,
                end,
                kind: TokenKind::Number,
            });
            if let Ok(n) = num_str.parse::<i32>() {
                tokens.push(Token::Number(n));
            } else {
                // Overflow or malformed number — still push 0 so token count stays consistent
                tokens.push(Token::Number(0));
            }
            continue;
        }

        // Identifier or label def or mnemonic
        if c.is_alphabetic() || c == '_' {
            let start = i;
            let mut word = String::new();
            while let Some(&(_, ch)) = chars.peek() {
                if ch.is_alphanumeric() || ch == '_' {
                    word.push(ch);
                    chars.next();
                } else {
                    break;
                }
            }
            let end = start + word.len();

            // Check if followed by ':'
            if let Some(&(_, ':')) = chars.peek() {
                chars.next(); // consume ':'
                spans.push(TokenSpan {
                    line: line_index,
                    start,
                    end: end + 1,
                    kind: TokenKind::LabelDef,
                });
                tokens.push(Token::LabelDef(word));
            } else {
                // Could be mnemonic or label reference - we'll classify later
                spans.push(TokenSpan {
                    line: line_index,
                    start,
                    end,
                    kind: TokenKind::Unknown, // will be reclassified
                });
                tokens.push(Token::Identifier(word));
            }
            continue;
        }

        // Skip unknown characters
        chars.next();
    }

    (tokens, spans)
}
