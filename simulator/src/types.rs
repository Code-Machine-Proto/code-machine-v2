// simulator/src/types.rs
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Phase {
    Fetch,
    Decode,
    Execute,
    Start,
    End,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProcessorId {
    Accumulator = 0,
    AccumulatorMa = 1,
    PolyRisc = 2,
}

impl ProcessorId {
    pub fn from_u8(id: u8) -> Option<Self> {
        match id {
            0 => Some(Self::Accumulator),
            1 => Some(Self::AccumulatorMa),
            2 => Some(Self::PolyRisc),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BusActivity {
    pub bus_name: String,
    pub value: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CycleState {
    pub cycle: u32,
    pub phase: Phase,
    pub registers: HashMap<String, i32>,
    pub memory: Vec<i32>,
    pub active_signals: Vec<String>,
    pub active_buses: Vec<BusActivity>,
    pub stimulated_line_state: i32,
    pub stimulated_memory: i32,
    pub instruction_memory: Option<Vec<u32>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompileResult {
    pub success: bool,
    pub program: Vec<u32>,
    pub diagnostics: Vec<Diagnostic>,
    pub tokens: Vec<TokenSpan>,
    pub data_memory: Option<Vec<i32>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Diagnostic {
    pub line: usize,
    pub column: usize,
    pub message: String,
    pub severity: Severity,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Severity {
    Error,
    Warning,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenSpan {
    pub line: usize,
    pub start: usize,
    pub end: usize,
    pub kind: TokenKind,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum TokenKind {
    Mnemonic,
    Register,
    Number,
    Label,
    LabelDef,
    Comment,
    Directive,
    Punctuation,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulationTrace {
    pub steps: Vec<CycleState>,
    pub halted: bool,
    pub error: Option<String>,
}
