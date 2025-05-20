package risc_v_tester

import risc_v_patterson.risc_v_patterson
import chisel3.iotesters._
import chisel3._

class add_tester(DUT: risc_v_patterson) extends PeekPokeTester(DUT) {

  val regValues = Array[Int](5, 3, 7, -9)

  for(i <- 0 until regValues.length){
    poke(DUT.io.Sim_RegistersVec(i), regValues(i).S)
  }
  poke(DUT.io.Sim_RegWrite, 1.B)
  step(1)
  System.out.println(peek(DUT.io.db_Registers))
}

class instruction_set_tester(DUT: risc_v_patterson) extends PeekPokeTester(DUT){

  val memory = risc_v_patterson.risc_v_patterson_utils.readMemoryFromArray(Array[Int](1, 5, 18, 3, 4))
  val program = risc_v_patterson.risc_v_patterson_utils.readProgramFromFile("./programs_files/risc_v.txt")

  for(i <- 0 until 256){
    poke(DUT.io.Sim_DataIn, memory(i).S)
    poke(DUT.io.Sim_InstructionIn, program(i).S)
    step(1)
  }
  System.out.println(program.mkString(" "))
  expect(DUT.io.Sim_InstructionMemoryLoaded, 1.B, "InstructionMemory should be loaded after 256 cycles")
  expect(DUT.io.Sim_DataMemoryLoaded, 1.B, "DataMemory should be loaded after 256 cycles")
  step(8)
}

object risc_v_patterson_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new risc_v_patterson()) {
    DUT => new add_tester(DUT)
  }
}