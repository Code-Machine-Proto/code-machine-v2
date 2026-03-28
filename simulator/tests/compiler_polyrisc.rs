use codemachine_simulator::compiler;
use codemachine_simulator::types::ProcessorId;

#[test]
fn test_compile_alu_three_reg() {
    let source = ".text\nadd r1,r2,r3";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x00010203);
}

#[test]
fn test_compile_alu_two_reg() {
    let source = ".text\nshr r5,r10";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x02050A00);
}

#[test]
fn test_compile_load_memory() {
    let source = ".text\nld r1,(r2)";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x08010200);
}

#[test]
fn test_compile_store_memory() {
    let source = ".text\nst (r3),r4";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x09000304);
}

#[test]
fn test_compile_ldi() {
    let source = ".text\nldi r7,255";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x0A0700FF);
}

#[test]
fn test_compile_branch() {
    let source = ".text\nbr 10";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x0C00000A);
}

#[test]
fn test_compile_brz() {
    let source = ".text\nbrz 5";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x0C010005);
}

#[test]
fn test_compile_stop() {
    let source = ".text\nstop";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x0F000000);
}

#[test]
fn test_compile_with_labels() {
    let source = ".text\nldi r1,10\nloop:\nsub r1,r1,r2\nbrnz loop\nstop";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[2], (0xC << 24) | (2 << 16) | 1);
}

#[test]
fn test_compile_data_section() {
    let source = ".text\nld r1,(r2)\nstop\n.data\nmydata: 42,100";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert!(result.data_memory.is_some());
    let dm = result.data_memory.unwrap();
    assert_eq!(dm[0], 42);
    assert_eq!(dm[1], 100);
}

#[test]
fn test_compile_mv() {
    let source = ".text\nmv r1,r2";
    let result = compiler::compile(source, ProcessorId::PolyRisc);
    assert!(result.success);
    assert_eq!(result.program[0], 0x07010200);
}
