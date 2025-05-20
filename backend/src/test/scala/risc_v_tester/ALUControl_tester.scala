package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.ALUControl

// IO
// ALUOp = Input(UInt(2.W))
// InstructionIn = Input(UInt(10.W))
// Operation = Output(UInt(4.W))

// LD SD
class ALUControl_test01(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 0.U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("add").U, "io.Operation === 2 when ALUOp = 0")
}

// BEQ
class ALUControl_test02(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 1.U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("subtract").U, "io.Operation === 6 when ALUOp = 1")
}

// ADD register type
class ALUControl_test03(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, 0.U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("add").U, "io.Operation === 2 when ALUOp = 2 and Instruction = 0")
}

// SUB register type
class ALUControl_test04(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, 256.U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("subtract").U, "io.Operation === 6 when ALUOp = 2 and Instruction = 256")
}

// AND register type
class ALUControl_test05(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, 7.U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("AND").U, "io.Operation === 0 when ALUOp = 2 and Instruction = 7")
}

// OR register type
class ALUControl_test06(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, 6.U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("OR").U, "io.Operation === 1 when ALUOp = 2 and Instruction = 6")
}

// XOR register type
class ALUControl_test07(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.registerOpcodes("XOR").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("XOR").U, "io.Operation === 3 when ALUOp = 2 and Instruction = 4")
}

// sll register type
class ALUControl_test08(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.registerOpcodes("sll").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("sll").U, "io.Operation === 4 when ALUOp = 2 and Instruction = 6")
}

// sra register type
class ALUControl_test09(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 2.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.registerOpcodes("sra").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("sra").U, "io.Operation === 5 when ALUOp = 2 and Instruction = 261")
}

// Immediate

// addi immediate
class ALUControl_test10(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 3.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.immediateOpcodes("addi").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("add").U, "io.Operation === 2 when ALUOp = 3 and Instruction = 0")
}

// andi immediate
class ALUControl_test11(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 3.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.immediateOpcodes("andi").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("AND").U, "io.Operation === 0 when ALUOp = 3 and Instruction = 7")
}

// ori immediate
class ALUControl_test12(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 3.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.immediateOpcodes("ori").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("OR").U, "io.Operation === 1 when ALUOp = 3 and Instruction = 6")
}

// xori immediate
class ALUControl_test13(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 3.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.immediateOpcodes("xori").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("XOR").U, "io.Operation === 3 when ALUOp = 3 and Instruction = 4")
}

// slli immediate
class ALUControl_test14(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 3.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.immediateOpcodes("slli").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("sll").U, "io.Operation === 4 when ALUOp = 3 and Instruction = 1")
}

// srai immediate
class ALUControl_test15(DUT: ALUControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.ALUOp, 3.U)
  poke(DUT.io.InstructionIn, risc_v_patterson.commons.immediateOpcodes("srai").U)
  expect(DUT.io.Operation, risc_v_patterson.commons.operations("sra").U, "io.Operation === 5 when ALUOp = 3 and Instruction = 5")
}

object ALUControl_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new ALUControl()) {
    DUT => {
      new ALUControl_test01(DUT)
      new ALUControl_test02(DUT)
      new ALUControl_test03(DUT)
      new ALUControl_test04(DUT)
      new ALUControl_test05(DUT)
      new ALUControl_test06(DUT)
      new ALUControl_test07(DUT)
      new ALUControl_test08(DUT)
      new ALUControl_test09(DUT)
      new ALUControl_test10(DUT)
      new ALUControl_test11(DUT)
      new ALUControl_test12(DUT)
      new ALUControl_test13(DUT)
      new ALUControl_test14(DUT)
      new ALUControl_test15(DUT)
    }
  }
}