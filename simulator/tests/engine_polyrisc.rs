use codemachine_simulator::compiler;
use codemachine_simulator::engine;
use codemachine_simulator::types::{Phase, ProcessorId};

#[test]
fn test_simulate_ldi_and_add() {
    let source = ".text\nldi r1,10\nldi r2,20\nadd r3,r1,r2\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("r1").unwrap(), 10);
    assert_eq!(*last.registers.get("r2").unwrap(), 20);
    assert_eq!(*last.registers.get("r3").unwrap(), 30);
}

#[test]
fn test_simulate_sub() {
    let source = ".text\nldi r1,50\nldi r2,20\nsub r3,r1,r2\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("r3").unwrap(), 30);
}

#[test]
fn test_simulate_memory_load_store() {
    let source = ".text\nldi r1,42\nldi r2,0\nst (r2),r1\nld r3,(r2)\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, compiled.data_memory.as_deref());
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("r3").unwrap(), 42);
    assert_eq!(last.memory[0], 42);
}

#[test]
fn test_simulate_branch_brz() {
    let source = ".text\nldi r1,0\nsub r1,r1,r1\nbrz skip\nldi r2,99\nskip:\nldi r3,1\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_ne!(*last.registers.get("r2").unwrap_or(&0), 99);
    assert_eq!(*last.registers.get("r3").unwrap(), 1);
}

#[test]
fn test_simulate_shift_operations() {
    let source = ".text\nldi r1,4\nshl r2,r1\nshr r3,r1\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("r2").unwrap(), 8);
    assert_eq!(*last.registers.get("r3").unwrap(), 2);
}

#[test]
fn test_simulate_mv() {
    let source = ".text\nldi r1,42\nmv r2,r1\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("r2").unwrap(), 42);
}

#[test]
fn test_simulate_phases() {
    let source = ".text\nldi r1,1\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert_eq!(trace.steps[0].phase, Phase::Start);
    assert_eq!(trace.steps[1].phase, Phase::Fetch);
    assert_eq!(trace.steps[2].phase, Phase::Decode);
    assert_eq!(trace.steps[3].phase, Phase::Execute);
}

#[test]
fn test_simulate_flags() {
    let source = ".text\nldi r1,5\nldi r2,5\nsub r3,r1,r2\nbrz success\nldi r10,0\nstop\nsuccess:\nldi r10,1\nstop";
    let compiled = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(compiled.success);
    let trace = engine::simulate(&compiled.program, ProcessorId::PolyRisc, None);
    assert!(trace.halted);
    let last = trace.steps.last().unwrap();
    assert_eq!(*last.registers.get("r10").unwrap(), 1);
}
