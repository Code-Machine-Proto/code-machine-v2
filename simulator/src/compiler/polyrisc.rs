use std::collections::HashMap;

use crate::compiler::lexer::{tokenize_line, Token};
use crate::types::{CompileResult, Diagnostic, Severity, TokenSpan};

/// Strip // comments from a line before tokenizing
fn strip_line_comment(line: &str) -> &str {
    if let Some(pos) = line.find("//") {
        &line[..pos]
    } else {
        line
    }
}

/// Strip parentheses from a line so the lexer can handle it
fn strip_parens(line: &str) -> String {
    line.replace(['(', ')'], " ")
}

/// Parse a register token like "r0" .. "r31", returning the register number.
fn parse_register(tok: &Token) -> Option<u32> {
    if let Token::Identifier(name) = tok {
        let lower = name.to_lowercase();
        if let Some(suffix) = lower.strip_prefix('r') {
            if let Ok(n) = suffix.parse::<u32>() {
                if n <= 31 {
                    return Some(n);
                }
            }
        }
    }
    None
}

#[derive(Debug)]
enum ParsedInstruction {
    Alu3 { opcode: u32, rdst: u32, rsrc1: u32, rsrc2: u32 },
    Alu2 { opcode: u32, rdst: u32, rsrc1: u32 },
    Load { rdst: u32, rsrc1: u32 },
    Store { rdst: u32, rsrc2: u32 },
    Ldi { rdst: u32, imm: u32 },
    Branch { cond: u32, target: BranchTarget },
    Stop,
}

#[derive(Debug)]
enum BranchTarget {
    Literal(u32),
    Label(String),
}

fn opcode_for_alu(mnemonic: &str) -> Option<(u32, bool)> {
    // Returns (opcode, is_3_reg)
    match mnemonic {
        "add" => Some((0, true)),
        "sub" => Some((1, true)),
        "shr" => Some((2, false)),
        "shl" => Some((3, false)),
        "not" => Some((4, false)),
        "and" => Some((5, true)),
        "or"  => Some((6, true)),
        "mv"  => Some((7, false)),
        _ => None,
    }
}

fn cond_code(mnemonic: &str) -> Option<u32> {
    match mnemonic {
        "br"    => Some(0),
        "brz"   => Some(1),
        "brnz"  => Some(2),
        "brlz"  => Some(3),
        "brgez" => Some(4),
        _ => None,
    }
}

#[derive(Debug)]
enum Section {
    Text,
    Data,
}

pub fn compile(source: &str) -> CompileResult {
    let lines: Vec<&str> = source.lines().collect();
    let mut all_spans: Vec<TokenSpan> = Vec::new();
    let mut diagnostics: Vec<Diagnostic> = Vec::new();

    // First pass: collect labels and parse instructions
    let mut parsed: Vec<(usize, ParsedInstruction)> = Vec::new();
    let mut label_addresses: HashMap<String, usize> = HashMap::new();
    let mut data_values: Vec<i32> = Vec::new();
    let mut current_address: usize = 0;
    let mut section = Section::Text;

    for (line_idx, raw_line) in lines.iter().enumerate() {
        let line = strip_line_comment(raw_line).trim();
        if line.is_empty() {
            continue;
        }

        // Preprocess: strip parens for lexer
        let cleaned = strip_parens(line);
        let (tokens, spans) = tokenize_line(&cleaned, line_idx);
        all_spans.extend(spans);

        // Filter out comments
        let tokens: Vec<Token> = tokens
            .into_iter()
            .filter(|t| !matches!(t, Token::Comment(_)))
            .collect();

        if tokens.is_empty() {
            continue;
        }

        // Check for directive
        if let Token::Directive(ref dir) = tokens[0] {
            match dir.as_str() {
                ".text" => { section = Section::Text; }
                ".data" => { section = Section::Data; }
                _ => {}
            }
            continue;
        }

        match section {
            Section::Data => {
                // Data section: label: val1,val2,...
                let data_tokens = if let Token::LabelDef(ref name) = tokens[0] {
                    // Register data label at current data offset
                    if label_addresses.contains_key(name) {
                        diagnostics.push(Diagnostic {
                            line: line_idx,
                            column: 0,
                            message: format!("Duplicate label '{}'", name),
                            severity: Severity::Error,
                        });
                    }
                    label_addresses.insert(name.clone(), data_values.len());
                    &tokens[1..]
                } else {
                    &tokens[..]
                };
                for tok in data_tokens {
                    match tok {
                        Token::Number(n) => data_values.push(*n),
                        Token::Comma => {}
                        _ => {}
                    }
                }
            }
            Section::Text => {
                // Check for label definition
                let (label, rest) = if let Token::LabelDef(ref name) = tokens[0] {
                    (Some(name.clone()), &tokens[1..])
                } else {
                    (None, &tokens[..])
                };

                if let Some(ref lbl) = label {
                    if label_addresses.contains_key(lbl) {
                        diagnostics.push(Diagnostic {
                            line: line_idx,
                            column: 0,
                            message: format!("Duplicate label '{}'", lbl),
                            severity: Severity::Error,
                        });
                    }
                    label_addresses.insert(lbl.clone(), current_address);
                }

                if rest.is_empty() {
                    continue;
                }

                // Parse instruction
                let mnemonic = if let Token::Identifier(ref name) = rest[0] {
                    name.to_lowercase()
                } else {
                    diagnostics.push(Diagnostic {
                        line: line_idx,
                        column: 0,
                        message: "Expected instruction mnemonic".into(),
                        severity: Severity::Error,
                    });
                    continue;
                };

                // Collect operand tokens (skip commas)
                let operands: Vec<&Token> = rest[1..]
                    .iter()
                    .filter(|t| !matches!(t, Token::Comma))
                    .collect();

                if mnemonic == "stop" {
                    parsed.push((line_idx, ParsedInstruction::Stop));
                    current_address += 1;
                } else if mnemonic == "ld" {
                    // ld rdst,(rsrc1) -> operands: rdst, rsrc1
                    if operands.len() >= 2 {
                        if let (Some(rdst), Some(rsrc1)) = (parse_register(operands[0]), parse_register(operands[1])) {
                            parsed.push((line_idx, ParsedInstruction::Load { rdst, rsrc1 }));
                            current_address += 1;
                        } else {
                            diagnostics.push(Diagnostic {
                                line: line_idx, column: 0,
                                message: "Invalid registers for ld".into(),
                                severity: Severity::Error,
                            });
                        }
                    } else {
                        diagnostics.push(Diagnostic {
                            line: line_idx, column: 0,
                            message: "ld requires 2 operands".into(),
                            severity: Severity::Error,
                        });
                    }
                } else if mnemonic == "st" {
                    // st (rdst),rsrc2 -> operands: rdst, rsrc2
                    if operands.len() >= 2 {
                        if let (Some(rdst), Some(rsrc2)) = (parse_register(operands[0]), parse_register(operands[1])) {
                            parsed.push((line_idx, ParsedInstruction::Store { rdst, rsrc2 }));
                            current_address += 1;
                        } else {
                            diagnostics.push(Diagnostic {
                                line: line_idx, column: 0,
                                message: "Invalid registers for st".into(),
                                severity: Severity::Error,
                            });
                        }
                    } else {
                        diagnostics.push(Diagnostic {
                            line: line_idx, column: 0,
                            message: "st requires 2 operands".into(),
                            severity: Severity::Error,
                        });
                    }
                } else if mnemonic == "ldi" {
                    // ldi rdst,imm
                    if operands.len() >= 2 {
                        if let Some(rdst) = parse_register(operands[0]) {
                            let imm = if let Token::Number(n) = operands[1] {
                                (*n as u32) & 0xFFFF
                            } else {
                                diagnostics.push(Diagnostic {
                                    line: line_idx, column: 0,
                                    message: "ldi requires immediate value".into(),
                                    severity: Severity::Error,
                                });
                                continue;
                            };
                            parsed.push((line_idx, ParsedInstruction::Ldi { rdst, imm }));
                            current_address += 1;
                        } else {
                            diagnostics.push(Diagnostic {
                                line: line_idx, column: 0,
                                message: "Invalid register for ldi".into(),
                                severity: Severity::Error,
                            });
                        }
                    } else {
                        diagnostics.push(Diagnostic {
                            line: line_idx, column: 0,
                            message: "ldi requires 2 operands".into(),
                            severity: Severity::Error,
                        });
                    }
                } else if let Some(cc) = cond_code(&mnemonic) {
                    // Branch instruction
                    if !operands.is_empty() {
                        let target = match operands[0] {
                            Token::Number(n) => BranchTarget::Literal((*n as u32) & 0xFFF),
                            Token::Identifier(name) => BranchTarget::Label(name.clone()),
                            _ => {
                                diagnostics.push(Diagnostic {
                                    line: line_idx, column: 0,
                                    message: "Invalid branch target".into(),
                                    severity: Severity::Error,
                                });
                                continue;
                            }
                        };
                        parsed.push((line_idx, ParsedInstruction::Branch { cond: cc, target }));
                        current_address += 1;
                    } else {
                        diagnostics.push(Diagnostic {
                            line: line_idx, column: 0,
                            message: "Branch requires target".into(),
                            severity: Severity::Error,
                        });
                    }
                } else if let Some((opcode, is_3_reg)) = opcode_for_alu(&mnemonic) {
                    if is_3_reg {
                        if operands.len() >= 3 {
                            if let (Some(rdst), Some(rsrc1), Some(rsrc2)) = (
                                parse_register(operands[0]),
                                parse_register(operands[1]),
                                parse_register(operands[2]),
                            ) {
                                parsed.push((line_idx, ParsedInstruction::Alu3 { opcode, rdst, rsrc1, rsrc2 }));
                                current_address += 1;
                            } else {
                                diagnostics.push(Diagnostic {
                                    line: line_idx, column: 0,
                                    message: "Invalid registers".into(),
                                    severity: Severity::Error,
                                });
                            }
                        } else {
                            diagnostics.push(Diagnostic {
                                line: line_idx, column: 0,
                                message: format!("{} requires 3 register operands", mnemonic),
                                severity: Severity::Error,
                            });
                        }
                    } else {
                        // 2-reg ALU
                        if operands.len() >= 2 {
                            if let (Some(rdst), Some(rsrc1)) = (
                                parse_register(operands[0]),
                                parse_register(operands[1]),
                            ) {
                                parsed.push((line_idx, ParsedInstruction::Alu2 { opcode, rdst, rsrc1 }));
                                current_address += 1;
                            } else {
                                diagnostics.push(Diagnostic {
                                    line: line_idx, column: 0,
                                    message: "Invalid registers".into(),
                                    severity: Severity::Error,
                                });
                            }
                        } else {
                            diagnostics.push(Diagnostic {
                                line: line_idx, column: 0,
                                message: format!("{} requires 2 register operands", mnemonic),
                                severity: Severity::Error,
                            });
                        }
                    }
                } else {
                    diagnostics.push(Diagnostic {
                        line: line_idx, column: 0,
                        message: format!("Unknown instruction '{}'", mnemonic),
                        severity: Severity::Error,
                    });
                }
            }
        }
    }

    if !diagnostics.is_empty() {
        return CompileResult {
            success: false,
            program: Vec::new(),
            diagnostics,
            tokens: all_spans,
            data_memory: None,
        };
    }

    // Second pass: encode instructions
    let mut program: Vec<u32> = Vec::new();

    for (line_idx, instr) in &parsed {
        let word = match instr {
            ParsedInstruction::Alu3 { opcode, rdst, rsrc1, rsrc2 } => {
                (opcode << 24) | (rdst << 16) | (rsrc1 << 8) | rsrc2
            }
            ParsedInstruction::Alu2 { opcode, rdst, rsrc1 } => {
                (opcode << 24) | (rdst << 16) | (rsrc1 << 8)
            }
            ParsedInstruction::Load { rdst, rsrc1 } => {
                (0x8 << 24) | (rdst << 16) | (rsrc1 << 8)
            }
            ParsedInstruction::Store { rdst, rsrc2 } => {
                (0x9 << 24) | (rdst << 8) | rsrc2
            }
            ParsedInstruction::Ldi { rdst, imm } => {
                (0xA << 24) | (rdst << 16) | (imm & 0xFFFF)
            }
            ParsedInstruction::Branch { cond, target } => {
                let addr = match target {
                    BranchTarget::Literal(a) => *a,
                    BranchTarget::Label(name) => {
                        if let Some(&a) = label_addresses.get(name) {
                            (a as u32) & 0xFFF
                        } else {
                            diagnostics.push(Diagnostic {
                                line: *line_idx,
                                column: 0,
                                message: format!("Undefined label '{}'", name),
                                severity: Severity::Error,
                            });
                            0
                        }
                    }
                };
                (0xC << 24) | (cond << 16) | (addr & 0xFFF)
            }
            ParsedInstruction::Stop => {
                0xF << 24
            }
        };
        program.push(word);
    }

    if !diagnostics.is_empty() {
        return CompileResult {
            success: false,
            program: Vec::new(),
            diagnostics,
            tokens: all_spans,
            data_memory: None,
        };
    }

    let data_memory = if data_values.is_empty() {
        None
    } else {
        Some(data_values)
    };

    CompileResult {
        success: true,
        program,
        diagnostics,
        tokens: all_spans,
        data_memory,
    }
}
