package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.ImmGen

// IO
// InstructionIn = Input(UInt(32.W))
// ImmOut = Output(SInt(32.W))

// Register
class ImmGen_test01(DUT: ImmGen) extends PeekPokeTester(DUT) {
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.opcodes("Register").U)
  expect(DUT.io.ImmOut, 0.S, "io.ImmOut === 0.S when opcode is Register")
}

// Load
class ImmGen_test02(DUT: ImmGen) extends PeekPokeTester(DUT) {
  // "b 000100000000 00000 000 00000 0000011" for a load instruction with Imm[11:0] = 256
  poke(DUT.io.InstructionIn, "b00010000000000000000000000000011".U)
  expect(DUT.io.ImmOut, 256.S, "io.ImmOut === 256.S when Imm[11:0] = 256 and opcode is Load")
}

// Store
class ImmGen_test03(DUT: ImmGen) extends PeekPokeTester(DUT) {
  // "b0000100 00000 00000 000 00000 0100011" for a Store instruction with Imm[11:0] = 128
  poke(DUT.io.InstructionIn, "b00001000000000000000000000100011".U)
  expect(DUT.io.ImmOut, 128.S, "io.ImmOut === 128.S when Imm[11:0] = 128 and opcode is Store")
}

// Branch
class ImmGen_test04(DUT: ImmGen) extends PeekPokeTester(DUT) {
  // "b 0  0  1  0  0  0  0 00000 00000 000 0  0  0  0  0 1100011 for a Branchh instruction with intended Imm[12:0] = 512"
  //    12 10 9  8  7  6  5                 4  3  2  1  11  <== Imm[12:0] 11 indexes, + 0 sll at Imm[0]
  poke(DUT.io.InstructionIn, "b00100000000000000000000001100011".U)
  expect(DUT.io.ImmOut, 512.S, "io.ImmOut === 512.S when Imm = 512 and opcode is Branch")
}

object ImmGen_tester extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new ImmGen()) {
    DUT => {
      new ImmGen_test01(DUT)
      new ImmGen_test02(DUT)
      new ImmGen_test03(DUT)
      new ImmGen_test04(DUT)
    }
  }
}