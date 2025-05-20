package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.InstructionMemory

// InstructionMemoryLoaded test
class InstructionMemory_test01(DUT: InstructionMemory) extends PeekPokeTester(DUT){
  for(i <- 0 until 256){
    poke(DUT.io.Sim_InstructionIn, 32)
    step(1)
  }
  expect(DUT.io.Sim_InstructionMemoryLoaded, 1, "io.Sim_InstructionMemoryLoaded == 1 after 256 cycles.")
}

// Read Instruction test
class InstructionMemory_test02(DUT: InstructionMemory) extends PeekPokeTester(DUT){

  val instruction_01 = 123
  val instruction_02 = 456

  for(i <- 0 until 128){
    poke(DUT.io.Sim_InstructionIn, instruction_01)
    step(1)
    poke(DUT.io.Sim_InstructionIn, instruction_02)
    step(1)
  }

  poke(DUT.io.ReadAddress, 0.U)
  step(1)
  expect(DUT.io.InstructionOut, instruction_01, "io.InstructionOut to be equal to instruction_01 at address 0")

  poke(DUT.io.ReadAddress, 1.U)
  step(1)
  expect(DUT.io.InstructionOut, instruction_02, "io.InstructionOut to be equal to instruction_02 at address 1")
}

object InstructionMemory_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new InstructionMemory()) {
    DUT => new InstructionMemory_test01(DUT)
  }
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new InstructionMemory()) {
    DUT => new InstructionMemory_test02(DUT)
  }
}