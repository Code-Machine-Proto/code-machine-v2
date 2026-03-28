pub mod accumulator;
pub mod lexer;
pub mod polyrisc;

use crate::types::{CompileResult, ProcessorId};

pub fn compile(source: &str, processor_id: ProcessorId) -> CompileResult {
    match processor_id {
        ProcessorId::Accumulator | ProcessorId::AccumulatorMa => {
            accumulator::compile(source, processor_id)
        }
        ProcessorId::PolyRisc => polyrisc::compile(source),
    }
}
