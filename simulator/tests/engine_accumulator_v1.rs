use codemachine_simulator::compiler;
use codemachine_simulator::engine;
use codemachine_simulator::types::{Phase, ProcessorId};

#[test]
fn test_simulate_load_store() {
    let source = "ld x\nst y\nstop\nx: 42\ny: 0";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(trace.halted);
    assert!(trace.error.is_none());
    let last = trace.steps.last().unwrap();
    assert_eq!(last.memory[4], 42);
}

#[test]
fn test_simulate_add() {
    let source = "ld x\nadd y\nst z\nstop\nx: 10\ny: 20\nz: 0";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(last.memory[6], 30);
    assert_eq!(*last.registers.get("ACC").unwrap(), 30);
}

#[test]
fn test_simulate_sub() {
    let source = "ld x\nsub y\nst z\nstop\nx: 50\ny: 20\nz: 0";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("ACC").unwrap(), 30);
}

#[test]
fn test_simulate_branch_taken() {
    let source = "ld zero\nbrz target\nld one\nstop\ntarget: stop\nzero: 0\none: 1";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("ACC").unwrap(), 0);
}

#[test]
fn test_simulate_branch_not_taken() {
    let source = "ld one\nbrz target\nld two\nstop\ntarget: stop\none: 1\ntwo: 2";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("ACC").unwrap(), 2);
}

#[test]
fn test_simulate_mul() {
    let source = "ld x\nmul y\nstop\nx: 3\ny: 7";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("ACC").unwrap(), 21);
}

#[test]
fn test_simulate_phases() {
    let source = "ld 2\nstop\n";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert_eq!(trace.steps[0].phase, Phase::Fetch);
    assert_eq!(trace.steps[1].phase, Phase::Decode);
    assert_eq!(trace.steps[2].phase, Phase::Execute);
}

#[test]
fn test_simulate_max_cycles() {
    let source = "br 0";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert!(!trace.halted);
    assert!(trace.steps.len() <= 1024);
}

#[test]
fn test_simulate_stimulated_line_state() {
    let source = "ld 2\nstop\n";
    let compiled = compiler::compile(source, ProcessorId::Accumulator);
    let trace = engine::simulate(&compiled.program, ProcessorId::Accumulator, None);
    assert_eq!(trace.steps[0].stimulated_line_state, 0); // fetch
    assert_eq!(trace.steps[1].stimulated_line_state, 3); // decode
    assert_eq!(trace.steps[2].stimulated_line_state, 1); // ld execute
}
