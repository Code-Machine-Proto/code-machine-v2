package accumulator.execs

import accumulator.accumulator_v1.{accumulator_v1, accumulator_v1_compiler}
import accumulator.accumulator_v2.{accumulator_v2, accumulator_v2_compiler}
import chisel3.UInt
import chisel3.iotesters._

import java.io.StringWriter
import scala.io.Source

object AccumulatorFilePathes {
  val FILE_PATH_ACCUMULATOR_V1 = "./output_files/output_v1.txt"
  val FILE_PATH_ACCUMULATOR_V2 = "./output_files/output_v2.txt"
}

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

  def compileAndRunV1(program: Array[String]): RunResultsV1 = {
    var result = ""
    val output = new StringWriter()

    val UIntProgram = accumulator.accumulator_compiler.compileFromArray(program, 1)
    val HexProgram = accumulator.accumulator_compiler.getHexcodeProgram(UIntProgram)

    chisel3.iotesters.Driver.execute(Array("--backend-name", "treadle"), () => new accumulator_v1(UIntProgram)) {
      DUT => new accumulator_v1_simulation(DUT, UIntProgram, output)
    }

    result = output.toString

    // result(n) follows filenames val order
    RunResultsV1(
      HexProgram,
      result,
      )
  }

  def compileAndRunV2(program: Array[String]): RunResultsV2 = {
    var result = ""
    val output = new StringWriter()

    val UIntProgram = accumulator.accumulator_compiler.compileFromArray(program, 2)
    val HexProgram = accumulator.accumulator_compiler.getHexcodeProgram(UIntProgram)

    chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v2()) {
      DUT => new accumulator_v2_simulation(DUT, UIntProgram, output)
    }

    result = output.toString

    // result(n) follows filenames val order
    RunResultsV2(
      HexProgram,
      result,
    )
  }
}

class accumulator_v1_simulation(DUT: accumulator.accumulator_v1.accumulator_v1, program: Array[UInt], output: StringWriter) extends PeekPokeTester(DUT) {
  var instructionsArray = program

  step(1)

  var simulation_ended = false
  var simulation_cycle = 0

  output.write("[")
  output.flush()
  while(!simulation_ended){
    output.write("{")
    output.flush()


    // Writing memory state 
    output.write("\"memoryState\" : [")
    for(memIdx <- 0 until DUT.io.InternalMemory.length){
      if(memIdx < DUT.io.InternalMemory.length - 1){
        output.write(peek(DUT.io.InternalMemory(memIdx)).toString + ",")
      }else{
        output.write(peek(DUT.io.InternalMemory(memIdx)).toString + "\r")
      }
    }
    output.write("],")
    output.flush()


    // Writing PC state 
    output.write("\"pcState\" : " + peek(DUT.io.PC).toString + ",")
    output.flush()

    // Writing ACC state
    output.write("\"accState\" : " + peek(DUT.io.ACC).toString + ",")
    output.flush()

    // Writing IR state
    output.write("\"irState\" : " + peek(DUT.io.IR).toString + ",")
    output.flush()

    //Writing instruction state
    output.write("\"instructionState\" : " + peek(DUT.io.State).toString + ",")
    output.flush()

    //Writing stimulated memory
    output.write("\"stimulatedMemory\" : " + peek(DUT.io.StimulatedMemoryCell).toString + ",")
    output.flush()

    //Writing stimulated lines
    output.write("\"stimulatedLineState\" : " + accumulator_v1_compiler.getStimulatedLines(peek(DUT.io.Instruction).toInt, peek(DUT.io.State).toInt, peek(DUT.io.ACC.asSInt())).toString())


    output.write("},")
    output.flush()
    step(1)

    simulation_cycle = simulation_cycle + 1
    simulation_ended = (peek(DUT.io.Instruction).toInt == 5) || (simulation_cycle == 1024)    
  }
  output.write("]")
  output.flush()
}

class accumulator_v2_simulation(DUT: accumulator.accumulator_v2.accumulator_v2, program: Array[UInt], output: StringWriter) extends PeekPokeTester(DUT) {

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
  
  output.write("[")
  output.flush()
  while(!simulation_ended){
    output.write("{")
    output.flush()

    // Writing memory state 
    output.write("\"memoryState\" : [")
    for(memIdx <- 0 until DUT.io.InternalMemory.length){
      if(memIdx < DUT.io.InternalMemory.length - 1){
        output.write(peek(DUT.io.InternalMemory(memIdx)).toString + ",")
      }else{
        output.write(peek(DUT.io.InternalMemory(memIdx)).toString + "\r")
      }
    }
    output.write("],")
    output.flush()
    // Writing PC state 
    output.write("\"pcState\" : " + peek(DUT.io.PC).toString + ",")
    output.flush()

    // Writing ACC state
    output.write("\"accState\" : " + peek(DUT.io.ACC.asSInt()).toString + ",")
    output.flush()

    // Writing IR state
    output.write("\"irState\" : " + peek(DUT.io.IR).toString + ",")
    output.flush()

    //Writing ma
    output.write("\"ma\" : " + peek(DUT.io.MA).toString + ",")
    output.flush()

    //Writing instruction state
    output.write("\"instructionState\" : " + peek(DUT.io.State).toString + ",")
    output.flush()

    //Writing stimulated memory
    output.write("\"stimulatedMemory\" : " + peek(DUT.io.StimulatedMemoryCell).toString + ",")
    output.flush()

    //Writing stimulated lines
    output.write("\"stimulatedLineState\": " + accumulator_v2_compiler.getStimulatedLines(peek(DUT.io.Instruction).toInt, peek(DUT.io.State).toInt, peek(DUT.io.ACC.asSInt())).toString())
    output.write("},")
    step(1)

    simulation_cycle = simulation_cycle + 1
    simulation_ended = (peek(DUT.io.Instruction).toInt == 19) || (simulation_cycle == 1024)
  }
  output.write("]")
  output.flush()
}

object exec extends App {
  //accumulator_execs.runCompileFromFilename("./programs_files/target_program_acc.txt", 2)
  // accumulator_execs.runCompileFromFilename("./programs_files/dummy_program_01.txt", 1)
  val program = accumulator.accumulator_compiler.readProgramFromFile("./programs_files/target_program_v2_shifts.txt")
  System.out.println(program.mkString(" "))
  accumulator.execs.accumulator_execs.compileAndRunV2(program)
}
