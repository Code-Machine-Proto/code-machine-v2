use std::collections::HashMap;

use crate::types::{CycleState, Phase, SimulationTrace};

const MAX_CYCLES: u32 = 4096;
const INST_MEM_SIZE: usize = 4096;
const DATA_MEM_SIZE: usize = 256;
const NUM_REGS: usize = 32;

pub fn simulate(program: &[u32], data_memory: Option<&[i32]>) -> SimulationTrace {
    // Instruction memory: 4096 x 28-bit words
    let mut inst_mem = vec![0u32; INST_MEM_SIZE];
    for (i, &word) in program.iter().enumerate() {
        if i < INST_MEM_SIZE {
            inst_mem[i] = word & 0x0FFF_FFFF; // 28 bits
        }
    }

    // Data memory: 256 x 16-bit signed words
    let mut memory = vec![0i32; DATA_MEM_SIZE];
    if let Some(data) = data_memory {
        for (i, &val) in data.iter().enumerate() {
            if i < DATA_MEM_SIZE {
                memory[i] = val as i16 as i32; // keep as 16-bit signed
            }
        }
    }

    // Registers: r0-r31, 16-bit signed, init to 0
    let mut regs = [0i16; NUM_REGS];

    let mut pc: u16 = 0; // 12-bit
    let mut ir: u32 = 0; // 28-bit
    let mut flag_z = false;
    let mut flag_n = false;

    let mut steps: Vec<CycleState> = Vec::new();
    let mut cycle: u32 = 0;
    let mut halted = false;

    enum FsmState {
        Start,
        Fetch,
        Decode,
        Execute,
    }

    let mut state = FsmState::Start;

    while cycle < MAX_CYCLES && !halted {
        match state {
            FsmState::Start => {
                pc = 0;
                steps.push(make_cycle_state(
                    cycle, Phase::Start, &regs, &memory, &inst_mem,
                    pc, ir, flag_z, flag_n, 0, -1,
                ));
                state = FsmState::Fetch;
            }
            FsmState::Fetch => {
                ir = inst_mem[pc as usize];

                steps.push(make_cycle_state(
                    cycle, Phase::Fetch, &regs, &memory, &inst_mem,
                    pc, ir, flag_z, flag_n, 0, pc as i32,
                ));

                state = FsmState::Decode;
            }
            FsmState::Decode => {
                steps.push(make_cycle_state(
                    cycle, Phase::Decode, &regs, &memory, &inst_mem,
                    pc, ir, flag_z, flag_n, 1, -1,
                ));

                state = FsmState::Execute;
            }
            FsmState::Execute => {
                let stimulated_line_state: i32;
                let mut next_pc = pc.wrapping_add(1) & 0xFFF;
                let mut stop = false;

                let top_nibble = (ir >> 24) & 0xF;

                if (ir >> 27) & 1 == 0 {
                    // ALU instruction: bit 27 = 0
                    let alu_op = (ir >> 24) & 0x7;
                    let rdst = ((ir >> 16) & 0x1F) as usize;
                    let rsrc1 = ((ir >> 8) & 0x1F) as usize;
                    let rsrc2 = (ir & 0x1F) as usize;

                    let a = regs[rsrc1];
                    let b = regs[rsrc2];

                    let result: i16 = match alu_op {
                        0 => a.wrapping_add(b),          // add
                        1 => a.wrapping_sub(b),          // sub
                        2 => ((a as u16) >> 1) as i16,   // shr (logical)
                        3 => ((a as u16) << 1) as i16,   // shl
                        4 => !a,                          // not
                        5 => a & b,                       // and
                        6 => a | b,                       // or
                        7 => a,                           // mv (pass-through)
                        _ => 0,
                    };

                    regs[rdst] = result;
                    flag_z = result == 0;
                    flag_n = result < 0;

                    // 2-reg ALU: shr, shl, not, mv (ops 2,3,4,7) -> state 2
                    // 3-reg ALU: add, sub, and, or (ops 0,1,5,6) -> state 3
                    stimulated_line_state = match alu_op {
                        0 | 1 | 5 | 6 => 3,
                        _ => 2,
                    };
                } else {
                    match top_nibble {
                        0x8 => {
                            // ld rdst,(rsrc1)
                            let rdst = ((ir >> 16) & 0x1F) as usize;
                            let rsrc1 = ((ir >> 8) & 0x1F) as usize;
                            let addr = (regs[rsrc1] as u16 & 0xFF) as usize;
                            regs[rdst] = memory[addr] as i16;
                            stimulated_line_state = 4;
                        }
                        0x9 => {
                            // st (rsrc1),rsrc2
                            let rsrc1 = ((ir >> 8) & 0x1F) as usize;
                            let rsrc2 = (ir & 0x1F) as usize;
                            let addr = (regs[rsrc1] as u16 & 0xFF) as usize;
                            memory[addr] = regs[rsrc2] as i32;
                            stimulated_line_state = 5;
                        }
                        0xA => {
                            // ldi rdst,imm
                            let rdst = ((ir >> 16) & 0x1F) as usize;
                            let imm = (ir & 0xFFFF) as i16;
                            regs[rdst] = imm;
                            stimulated_line_state = 6;
                        }
                        0xC => {
                            // branch
                            let cond_code = (ir >> 16) & 0xF;
                            let target = (ir & 0xFFF) as u16;

                            let taken = match cond_code {
                                0 => true,        // always
                                1 => flag_z,      // Z
                                2 => !flag_z,     // !Z
                                3 => flag_n,      // N
                                4 => !flag_n,     // !N
                                _ => false,
                            };

                            if taken {
                                next_pc = target;
                                stimulated_line_state = 7;
                            } else {
                                stimulated_line_state = 8;
                            }
                        }
                        0xF => {
                            // stop
                            stop = true;
                            stimulated_line_state = 8;
                        }
                        _ => {
                            stimulated_line_state = 8; // nop
                        }
                    }
                }

                pc = next_pc;
                if stop {
                    halted = true;
                }

                steps.push(make_cycle_state(
                    cycle, Phase::Execute, &regs, &memory, &inst_mem,
                    pc, ir, flag_z, flag_n, stimulated_line_state, -1,
                ));

                if halted {
                    // Add End state
                    cycle += 1;
                    steps.push(make_cycle_state(
                        cycle, Phase::End, &regs, &memory, &inst_mem,
                        pc, ir, flag_z, flag_n, 8, -1,
                    ));
                } else {
                    state = FsmState::Fetch;
                }
            }
        }

        cycle += 1;
    }

    SimulationTrace {
        steps,
        halted,
        error: None,
    }
}

#[allow(clippy::too_many_arguments)]
fn make_cycle_state(
    cycle: u32,
    phase: Phase,
    regs: &[i16; NUM_REGS],
    memory: &[i32],
    inst_mem: &[u32],
    pc: u16,
    ir: u32,
    flag_z: bool,
    flag_n: bool,
    stimulated_line_state: i32,
    stimulated_memory: i32,
) -> CycleState {
    let mut reg_map = HashMap::new();
    reg_map.insert("PC".to_string(), pc as i32);
    reg_map.insert("IR".to_string(), ir as i32);
    reg_map.insert("Z".to_string(), flag_z as i32);
    reg_map.insert("N".to_string(), flag_n as i32);
    for (i, &val) in regs.iter().enumerate().take(NUM_REGS) {
        reg_map.insert(format!("r{}", i), val as i32);
    }

    CycleState {
        cycle,
        phase,
        registers: reg_map,
        memory: memory.to_vec(),
        active_signals: Vec::new(),
        active_buses: Vec::new(),
        stimulated_line_state,
        stimulated_memory,
        instruction_memory: Some(inst_mem.to_vec()),
    }
}
