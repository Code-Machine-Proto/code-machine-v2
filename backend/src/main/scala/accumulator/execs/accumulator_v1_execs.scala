package accumulator.execs

import java.io.FileWriter

import accumulator.accumulator_v1.{accumulator_v1, accumulator_v1_compiler}
import chisel3.UInt
import chisel3.iotesters._

import scala.io.Source

final case class RunResultsV10(
                             hex: Array[String],
                             internal_memory_status: Array[String],
                             pc_status: Array[String],
                             acc_status: Array[String],
                             ir_status: Array[String],
                             state_status: Array[String],
                             stimulated_memory_address: Array[String],
                             lines_status: Array[String],
                           )

object accumulator_v1_execs {
  def getHexcode(program: Array[String]): Array[String] = {
    var instructionsArray = accumulator_v1_compiler.getHexCodeFromArray(program)
    instructionsArray
  }

  def compileAndRun(program: Array[String], id: Int): RunResultsV1 = {

    var result = ""

    val filenames = Array[String](
      "./output_files/internal_memory_status_" + id + ".txt",
      "./output_files/pc_status" + id + ".txt",
      "./output_files/acc_status" + id + ".txt",
      "./output_files/ir_status" + id + ".txt",
      "./output_files/state_status" + id + ".txt",
      "./output_files/stimulated_memory_status" + id + ".txt",
      "./output_files/stimulated_lines_status" + id + ".txt"
    )

    val UIntProgram = accumulator.accumulator_compiler.compileFromArray(program, 1)

    chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
      DUT => new accumulator_v1_tester_with_array(DUT, program, id)
    }

    for(sourcefile <- filenames){
      var content = ""
      for(line <- Source.fromFile(sourcefile).getLines){
        content = content + line
      }
      result = result + content
    }

    // result(n) follows filenames val order
    RunResultsV1(
      accumulator_v1_compiler.getHexCodeFromArray(program),
      result)
  }
}

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

class accumulator_v1_tester_with_array(DUT: accumulator_v1, program: Array[String], id: Int) extends PeekPokeTester(DUT) {

  val output_internal_memory = new FileWriter("./output_files/internal_memory_status_" + id + ".txt", false);
  val output_pc = new FileWriter("./output_files/pc_status" + id + ".txt", false);
  val output_acc = new FileWriter("./output_files/acc_status" + id + ".txt", false);
  val output_ir = new FileWriter("./output_files/ir_status" + id + ".txt", false);
  val output_state = new FileWriter("./output_files/state_status" + id + ".txt", false);
  val output_stimulated_memory = new FileWriter("./output_files/stimulated_memory_status" + id + ".txt", false);
  val output_stimulated_lines = new FileWriter("./output_files/stimulated_lines_status" + id + ".txt", false);

//  var instructionsArray = accumulator_v1_compiler.compileFromArray(program)
  var instructionsArray = accumulator.accumulator_compiler.compileFromArray(program, 1)
  for(idx <- 0 until instructionsArray.length) {
    poke(DUT.io.InputMemory(idx), instructionsArray(idx))
  }
  step(256)

  val numberOfInstructions = accumulator_v1_compiler.getNumberOfInstructions(program)

  for(idx <- 0 until numberOfInstructions * 3){

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

    output_acc.write(peek(DUT.io.ACC.asSInt()).toString + "\n")
    output_acc.flush()

    output_ir.write(peek(DUT.io.IR).toString + "\n")
    output_ir.flush()

    output_state.write(peek(DUT.io.State).toString + "\n")
    output_state.flush()

    output_stimulated_memory.write(peek(DUT.io.StimulatedMemoryCell).toString + "\n")
    output_stimulated_memory.flush()

    var stimulatedLines = accumulator_v1_compiler.getStimulatedLines(peek(DUT.io.Instruction).toInt, peek(DUT.io.State).toInt, peek(DUT.io.ACC.asSInt))
    output_stimulated_memory.write(stimulatedLines + "\n")
    output_stimulated_memory.flush()
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
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("currentProgram.txt", 1)
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

  var instructionsString = Array[String]()
  val programFilename = "./programs_files/program_nojump.txt";
  instructionsString = accumulator_v1_compiler.readFile(programFilename);
  instructionsString = accumulator_v1_compiler.removeEmptyLines(instructionsString);
  instructionsString = accumulator_v1_compiler.formatSpaces(instructionsString);
  instructionsString = accumulator_v1_compiler.removeDirectives(instructionsString)

  accumulator_v1_execs.compileAndRun(instructionsString, 123456)
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
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)){
    DUT => new accumulator_v1_getHexcode_param(DUT, args)
  }
}

object accumulator_v1_tester_with_array_exec extends App {
  var content = Array[String]()
  for(line <- Source.fromFile("./programs_files/negative_values_v1.txt").getLines){
    content = content :+ line
  }

  System.out.println(content.mkString(" "))
  val UIntProgram = accumulator.accumulator_compiler.compileFromFilename("currentProgram.txt", 1)
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v1(UIntProgram)) {
    DUT => new accumulator_v1_tester_with_array(DUT, content, 123456789)
  }
}
