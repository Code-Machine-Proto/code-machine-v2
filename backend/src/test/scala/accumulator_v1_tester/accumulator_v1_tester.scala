package accumulator_v1_tester

import java.io.FileWriter

import accumulator.accumulator_v1.{accumulator_v1, accumulator_v1_compiler}
import chisel3.iotesters._

class accumulator_v1_tester(DUT: accumulator_v1, programFilename: String) extends PeekPokeTester(DUT) {
  val filename = "./programs/" + programFilename;

  val output_internal_memory = new FileWriter("./output_files/internal_memory_status.txt", false);
  val output_pc = new FileWriter("./output_files/pc_status.txt", false);
  val output_acc = new FileWriter("./output_files/acc_status.txt", false);
  val output_ir = new FileWriter("./output_files/ir_status.txt", false);
  val output_state = new FileWriter("./output_files/state_status.txt", false);

  var instructionsArray = accumulator_v1_compiler.compile(filename)
  for(idx <- 0 until instructionsArray.length) {
    poke(DUT.io.InputMemory(idx), instructionsArray(idx))
  }
  step(256)

  for(idx <- 0 until 16){

    for(memIdx <- 0 until DUT.io.InternalMemory.length){
      if(memIdx < DUT.io.InternalMemory.length - 1){
        output_internal_memory.write(peek(DUT.io.InternalMemory(memIdx)).toString + ",")
      }else{
        output_internal_memory.write(peek(DUT.io.InternalMemory(memIdx)).toString + "\r")
      }
      output_internal_memory.flush()
    }
    output_internal_memory.write("\n")
    output_internal_memory.flush()

    output_pc.write(peek(DUT.io.PC).toString + "\n")
    output_pc.flush()
    output_acc.write(peek(DUT.io.ACC).toString + "\n")
    output_acc.flush()
    output_ir.write(peek(DUT.io.IR).toString + "\n")
    output_ir.flush()
    output_state.write(peek(DUT.io.State).toString + "\n")
    output_state.flush()

    step(1)
  }
}

class accumulator_v1_getHexcode(DUT: accumulator_v1, programFilename: String) extends PeekPokeTester(DUT) {
  val filename = "./programs_files/" + programFilename;
  val output_hex_program = new FileWriter("./output_files/hex_program.txt", false);

  var instructionsArray = accumulator_v1_compiler.getHexCode(filename)
  for(idx <- 0 until instructionsArray.length) {
    output_hex_program.write(instructionsArray(idx).toString + "\n")
    output_hex_program.flush()
  }
}

class accumulator_v1_compile(DUT: accumulator_v1, programFilename: String) extends PeekPokeTester(DUT) {
  val filename = "./programs/" + programFilename;
  accumulator_v1_compiler.compile(filename);
}

object accumulator_v1_tester_exec extends App {
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("program_nojump.txt", 1)
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
    DUT => new accumulator_v1_tester(DUT, "program_nojump.txt")
  }
}

object accumulator_v1_getHexcode_exec extends App {
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("currentProgram.txt", 1)
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
    DUT => new accumulator_v1_getHexcode(DUT, "currentProgram.txt")
  }
}

object accumulator_v1_compileAndRun_exec extends App {
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("currentProgram.txt", 1)
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
    DUT => new accumulator_v1_tester(DUT, "currentProgram.txt")
  }
}

object accumulator_v1_compile_exec extends App {
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("currentProgram.txt", 1)
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
    DUT => new accumulator_v1_compile(DUT, "currentProgram.txt")
  }
}

object accumulator_v1_sandbox_exec extends App {
  // For dev. purposes
  println("Bonjour")
}

class accumulator_v1_getHexcode_param(DUT: accumulator_v1, arguments: Array[String]) extends PeekPokeTester(DUT) {
  val programfilename = "./programs_files/" + arguments(1);
  val outputFilename = "./output_files/hex_program_" + arguments(0) + ".txt";
  val output_hex_program = new FileWriter(outputFilename, false);

  var instructionsArray = accumulator_v1_compiler.getHexCode(programfilename)
  for(idx <- 0 until instructionsArray.length) {
    output_hex_program.write(instructionsArray(idx).toString + "\n")
    output_hex_program.flush()
  }
}

object accumulator_v1_getHexcode_param_exec extends App {
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("currentProgram.txt", 1)
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
    DUT => new accumulator_v1_getHexcode_param(DUT, args)
  }
}

