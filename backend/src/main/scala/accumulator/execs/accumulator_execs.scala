package accumulator.execs

import accumulator.accumulator_v1.{accumulator_v1, accumulator_v1_compiler}
import accumulator.accumulator_v2.{accumulator_v2, accumulator_v2_compiler}
import chisel3.UInt
import chisel3.iotesters._

import java.io.FileWriter
import scala.io.Source

final case class RunResultsV1(
                             hex: Array[String],
                             output: String,
                           )

final case class RunResultsV2(
                               hex: Array[String],
                               output: String,
                             )

object accumulator_execs {
  def runCompileFromFilename(filename: String, version: Int): Unit = {
    System.out.println(accumulator.accumulator_compiler.compileFromFilename(filename, version).mkString("\n"));
  }

  def compileAndRunV1(program: Array[String], id: Int): RunResultsV1 = {
    var result = ""

    val filename = "./output_files/output_v1.txt"

    val UIntProgram = accumulator.accumulator_compiler.compileFromArray(program, 1)
    val HexProgram = accumulator.accumulator_compiler.getHexcodeProgram(UIntProgram)

    chisel3.iotesters.Driver.execute(Array("--backend-name", "treadle"), () => new accumulator_v1(UIntProgram)) {
      DUT => new accumulator_v1_simulation(DUT, UIntProgram, id)
    }

    var content = ""
    for(line <- Source.fromFile(filename).getLines){
      content = content + line
    }
    result = content

    // result(n) follows filenames val order
    RunResultsV1(
      HexProgram,
      result,
      )
  }

  def compileAndRunV2(program: Array[String], id: Int): RunResultsV2 = {
    var result = Array[Array[String]]()

    val filenames = Array[String](
      "./output_files/acc_v2_internal_memory_status_" + id + ".txt",
      "./output_files/acc_v2_pc_status" + id + ".txt",
      "./output_files/acc_v2_acc_status" + id + ".txt",
      "./output_files/acc_v2_ir_status" + id + ".txt",
      "./output_files/acc_v2_ma_status" + id + ".txt",
      "./output_files/acc_v2_state_status" + id + ".txt",
      "./output_files/acc_v2_stimulated_memory_status" + id + ".txt",
      "./output_files/acc_v2_stimulated_lines_status" + id + ".txt"
    )

    val UIntProgram = accumulator.accumulator_compiler.compileFromArray(program, 2)
    val HexProgram = accumulator.accumulator_compiler.getHexcodeProgram(UIntProgram)

    chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v2()) {
      DUT => new accumulator_v2_simulation(DUT, UIntProgram, id)
    }

    for(sourcefile <- filenames){
      var content = Array[String]()
      for(line <- Source.fromFile(sourcefile).getLines){
        content = content :+ line
      }
      result = result :+ content
    }

    // result(n) follows filenames val order
    RunResultsV2(
      HexProgram,
      result(0),
      result(1),
      result(2),
      result(3),
      result(4),
      result(5),
      result(6),
      result(7)
    )
  }
}

class accumulator_v1_simulation(DUT: accumulator.accumulator_v1.accumulator_v1, program: Array[UInt], id: Int) extends PeekPokeTester(DUT) {
  val output = new FileWriter("./output_files/output.txt", false);
  var instructionsArray = program
  var stimulatedLines = Array[String]()

  step(1)

  var simulation_ended = false
  var simulation_cycle = 0

  output.write("[")
  output.flush()
  while(!simulation_ended){
    output.write("{")
    output.flush()


    // Writing memory state 
    output.write("memoryState : [")
    for(memIdx <- 0 until DUT.io.InternalMemory.length){
      if(memIdx < DUT.io.InternalMemory.length - 1){
        output.write(peek(DUT.io.InternalMemory(memIdx)).toString + ",")
      }else{
        output.write(peek(DUT.io.InternalMemory(memIdx)).toString + "\r")
      }
    }
    output.write("]},")
    output.flush()


    // Writing PC state 
    output.write("pcState : {" + peek(DUT.io.PC).toString + "},")
    output.flush()

    // Writing ACC state
    output.write("accState : {" + peek(DUT.io.ACC).toString + "},")
    output.flush()

    // Writing IR state
    output.write("irState : {" + peek(DUT.io.IR).toString + "},")
    output.flush()

    //Writing instruction state
    output.write("instructionState : {" + peek(DUT.io.State).toString + "},")
    output.flush()

    //Writing stimulated memory
    output.write("stimulatedMemory : {" + peek(DUT.io.StimulatedMemoryCell).toString + "}")
    output.flush()

    //Writing stimulated lines
    //TODO

    step(1)

    simulation_cycle = simulation_cycle + 1
    simulation_ended = (peek(DUT.io.Instruction).toInt == 5) || (simulation_cycle == 512)    
  }
  output.write("]")
  output.flush()
}

class accumulator_v2_simulation(DUT: accumulator.accumulator_v2.accumulator_v2, program: Array[UInt], id: Int) extends PeekPokeTester(DUT) {
  val output_internal_memory = new FileWriter("./output_files/acc_v2_internal_memory_status_" + id + ".txt", false);
  val output_pc = new FileWriter("./output_files/acc_v2_pc_status" + id + ".txt", false);
  val output_acc = new FileWriter("./output_files/acc_v2_acc_status" + id + ".txt", false);
  val output_ir = new FileWriter("./output_files/acc_v2_ir_status" + id + ".txt", false);
  val output_ma = new FileWriter("./output_files/acc_v2_ma_status" + id + ".txt", false);
  val output_state = new FileWriter("./output_files/acc_v2_state_status" + id + ".txt", false);
  val output_stimulated_memory = new FileWriter("./output_files/acc_v2_stimulated_memory_status" + id + ".txt", false);
  val output_stimulated_lines = new FileWriter("./output_files/acc_v2_stimulated_lines_status" + id + ".txt", false);

  //  var instructionsArray = accumulator_v2_compiler.compileFromArray(program)
  var instructionsArray = program
  var stimulatedLines = Array[String]()

  for(idx <- 0 until instructionsArray.length) {
    poke(DUT.io.InputMemory(idx), instructionsArray(idx))
  }
  step(256)

  //val numberOfInstructions = accumulator_v2_compiler.getNumberOfInstructions(program)

  var simulation_ended = false
  var simulation_cycle = 0

  while(!simulation_ended){

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

    output_ma.write(peek(DUT.io.MA).toString + "\n")
    output_ma.flush()

    output_state.write(peek(DUT.io.State).toString + "\n")
    output_state.flush()

    output_stimulated_memory.write(peek(DUT.io.StimulatedMemoryCell).toString + "\n")
    output_stimulated_memory.flush()

    stimulatedLines = accumulator_v2_compiler.getStimulatedLines(peek(DUT.io.Instruction).toInt, peek(DUT.io.State).toInt)

    var lineIdx = 0
    for(line <- stimulatedLines){
      if(lineIdx == stimulatedLines.size - 1) {
        output_stimulated_lines.write(line + "\r")
      }else{
        output_stimulated_lines.write(line + ",")
      }
      lineIdx = lineIdx + 1
      output_stimulated_lines.flush()
    }
    output_stimulated_lines.write("\n")
    output_stimulated_lines.flush()

    step(1)

    simulation_cycle = simulation_cycle + 1
    simulation_ended = (peek(DUT.io.Instruction).toInt == 19) || (simulation_cycle == 512)
  }
}

object exec extends App {
  //accumulator_execs.runCompileFromFilename("./programs_files/target_program_acc.txt", 2)
  // accumulator_execs.runCompileFromFilename("./programs_files/dummy_program_01.txt", 1)
  val program = accumulator.accumulator_compiler.readProgramFromFile("./programs_files/target_program_v2_shifts.txt")
  System.out.println(program.mkString(" "))
  accumulator.execs.accumulator_execs.compileAndRunV2(program, 112233)
}
