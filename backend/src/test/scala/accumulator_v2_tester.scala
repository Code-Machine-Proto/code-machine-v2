import java.io.FileWriter

import accumulator.accumulator_v2.{accumulator_v2, accumulator_v2_compiler}
import chisel3.iotesters._

class accumulator_v2_tester(DUT: accumulator_v2) extends PeekPokeTester(DUT){
  val filename = "./programs/program_jump.txt"

  val output_internal_memory = new FileWriter("internal_memory_file.txt", false);
  val output_pc = new FileWriter("pc_file.txt", false);

  var instructionsArray = accumulator_v2_compiler.compile(filename)
  for(idx <- 0 until instructionsArray.length) {
    poke(DUT.io.InputMemory(idx), instructionsArray(idx))
  }
  step(260)

  for(idx <- 0 until 256){
    step(1)
  }
}

object accumulator_v2_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v2()) {
    DUT => new accumulator_v2_tester(DUT)
  }
}

object accumulator_v2_sandbox_exec extends App {
  // For dev. purposes
  println(accumulator_v2_compiler.intToBinary16(-5))
}