package accumulator.execs

import java.io.FileWriter
import accumulator.execs.AccumulatorFilePathes
import accumulator.accumulator_v2.{accumulator_v2, accumulator_v2_compiler}
import chisel3.iotesters.PeekPokeTester

import scala.io.Source

final case class RunResultsV20(
                             hex: Array[String],
                             internal_memory_status: Array[String],
                             pc_status: Array[String],
                             acc_status: Array[String],
                             ir_status: Array[String],
                             ma_status: Array[String],
                             state_status: Array[String],
                             stimulated_memory_address: Array[String],
                             lines_status: Array[String],
                           )

object accumulator_v2_execs {
  def getHexcode(program: Array[String]): Array[String] = {
    val instructionsArray = accumulator.accumulator_v2.accumulator_v2_compiler.getHexCodeFromArray(program);
    instructionsArray
  }

  def compileAndRun(program: Array[String], id: Int): RunResultsV2 = {
    var result = ""

    val filename = AccumulatorFilePathes.FILE_PATH_ACCUMULATOR_V2

    chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v2()) {
      DUT => new accumulator_v2_tester_with_array(DUT, program, id)
    }

    var content = ""
    for(line <- Source.fromFile(filename).getLines){
      content = content + line
    }
    result = content

    // result(n) follows filenames val order
    RunResultsV2(
      accumulator_v2_compiler.getHexCodeFromArray(program),
      result,
    )
  }
}

class accumulator_v2_tester_with_array(DUT: accumulator_v2, program: Array[String], id: Int) extends PeekPokeTester(DUT) {

  val output_internal_memory = new FileWriter("./output_files/acc_v2_internal_memory_status_" + id + ".txt", false);
  val output_pc = new FileWriter("./output_files/acc_v2_pc_status" + id + ".txt", false);
  val output_acc = new FileWriter("./output_files/acc_v2_acc_status" + id + ".txt", false);
  val output_ir = new FileWriter("./output_files/acc_v2_ir_status" + id + ".txt", false);
  val output_ma = new FileWriter("./output_files/acc_v2_ma_status" + id + ".txt", false);
  val output_state = new FileWriter("./output_files/acc_v2_state_status" + id + ".txt", false);
  val output_stimulated_memory = new FileWriter("./output_files/acc_v2_stimulated_memory_status" + id + ".txt", false);
  val output_stimulated_lines = new FileWriter("./output_files/acc_v2_stimulated_lines_status" + id + ".txt", false);

//  var instructionsArray = accumulator_v2_compiler.compileFromArray(program)
  var instructionsArray = accumulator.accumulator_compiler.compileFromArray(program, 2)

  for(idx <- 0 until instructionsArray.length) {
    poke(DUT.io.InputMemory(idx), instructionsArray(idx))
  }
  step(256)

  val numberOfInstructions = accumulator_v2_compiler.getNumberOfInstructions(program)


  var simulation_cycle = 0
  var simulation_ended = false

  while(!simulation_ended){
    for(memIdx <- 0 until DUT.io.InternalMemory.length){
      if(memIdx < DUT.io.InternalMemory.length - 1){
        output_internal_memory.write(peek(DUT.io.InternalMemory(memIdx)).toInt.toString + ",")
      }else{
        output_internal_memory.write(peek(DUT.io.InternalMemory(memIdx)).toInt.toString + "\r")
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

    var stimulatedLines = accumulator_v2_compiler.getStimulatedLines(peek(DUT.io.Instruction).toInt, peek(DUT.io.State).toInt, peek(DUT.io.ACC.asSInt))
    output_stimulated_lines.write(stimulatedLines + "\n")
    output_stimulated_lines.flush()

    step(1)
    simulation_cycle = simulation_cycle + 1
    simulation_ended = (peek(DUT.io.Instruction).toInt == 19) || simulation_cycle == 1024
  }
}

object accumulator_v2_tester_with_array_exec extends App {
  var content = Array[String]()
  for(line <- Source.fromFile("./programs_files/target_program_v2_shifts.txt").getLines){
    content = content :+ line
  }

  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new accumulator_v2()) {
    DUT => new accumulator_v2_tester_with_array(DUT, content, 112233)
  }
}