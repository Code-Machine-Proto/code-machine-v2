use codemachine_simulator::compiler;
use codemachine_simulator::types::ProcessorId;

#[test]
fn test_compile_simple_program() {
    let source = "ld 5\nadd 6\nst 7\nstop";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(result.success);
    assert_eq!(result.diagnostics.len(), 0);
    assert_eq!(result.program[0], 0x0405); // ld 5
    assert_eq!(result.program[1], 0x0006); // add 6
    assert_eq!(result.program[2], 0x0307); // st 7
    assert_eq!(result.program[3], 0x0500); // stop
}

#[test]
fn test_compile_with_labels() {
    let source = "ld x\nadd y\nst z\nstop\nx: 10\ny: 20\nz: 0";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(result.success);
    assert_eq!(result.program[0], (4 << 8) | 4);
    assert_eq!(result.program[1], (0 << 8) | 5);
    assert_eq!(result.program[2], (3 << 8) | 6);
    assert_eq!(result.program[3], (5 << 8) | 0);
    assert_eq!(result.program[4], 10);
    assert_eq!(result.program[5], 20);
    assert_eq!(result.program[6], 0);
}

#[test]
fn test_compile_branch_instructions() {
    let source = "ld 5\nbrz loop\nstop\nloop: nop\nbr loop";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(result.success);
    assert_eq!(result.program[0], (4 << 8) | 5);
    assert_eq!(result.program[1], (8 << 8) | 3);
    assert_eq!(result.program[2], (5 << 8) | 0);
    assert_eq!(result.program[3], (6 << 8) | 0);
    assert_eq!(result.program[4], (7 << 8) | 3);
}

#[test]
fn test_compile_label_with_multiple_values() {
    let source = "ld data\nstop\ndata: 42, 100, 255";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(result.success);
    assert_eq!(result.program[2], 42);
    assert_eq!(result.program[3], 100);
    assert_eq!(result.program[4], 255);
}

#[test]
fn test_compile_label_offset() {
    let source = "ld data + 1\nstop\ndata: 42, 100";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(result.success);
    assert_eq!(result.program[0], (4 << 8) | 3);
}

#[test]
fn test_compile_error_unknown_instruction() {
    let source = "foo 5\nstop";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(!result.success);
    assert!(!result.diagnostics.is_empty());
    assert_eq!(result.diagnostics[0].line, 0);
}

#[test]
fn test_compile_directives_stripped() {
    let source = ".text\nld 5\nstop";
    let result = compiler::compile(source, ProcessorId::Accumulator);
    assert!(result.success);
    assert_eq!(result.program[0], (4 << 8) | 5);
    assert_eq!(result.program[1], (5 << 8) | 0);
}
