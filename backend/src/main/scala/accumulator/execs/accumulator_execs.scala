package accumulator.execs

import accumulator.accumulator_v1.{accumulator_v1, accumulator_v1_compiler}
import accumulator.accumulator_v2.{accumulator_v2, accumulator_v2_compiler}
import chisel3.UInt
import chisel3.iotesters._
import commons.SimulationConfig

import java.io.StringWriter
import scala.io.Source

object AccumulatorFilePathes {
  val FILE_PATH_ACCUMULATOR_V1 = "./output_files/output_v1.txt"
  val FILE_PATH_ACCUMULATOR_V2 = "./output_files/output_v2.txt"
}

final case class RunResultsV1(
    hex: Array[String],
    output: String
)

final case class RunResultsV2(
    hex: Array[String],
    output: String
)

object accumulator_execs {
  def runCompileFromFilename(filename: String, version: Int): Unit = {
    System.out.println(
      accumulator.accumulator_compiler
        .compileFromFilename(filename, version)
        .mkString("\n")
    );
  }

  def compileAndRunV1(program: Array[String]): RunResultsV1 = {
    var result = ""
    val output = new StringWriter()

    val UIntProgram =
      accumulator.accumulator_compiler.compileFromArray(program, 1)
    val HexProgram =
      accumulator.accumulator_compiler.getHexcodeProgram(UIntProgram)

    chisel3.iotesters.Driver.execute(
      Array("--backend-name", "treadle"),
      () => new accumulator_v1(UIntProgram)
    ) { DUT =>
      new accumulator_v1_simulation(DUT, UIntProgram, output)
    }

    result = output.toString

    // result(n) follows filenames val order
    RunResultsV1(
      HexProgram,
      result
    )
  }

  def compileAndRunV2(program: Array[String]): RunResultsV2 = {
    var result = ""
    val output = new StringWriter()

    val UIntProgram =
      accumulator.accumulator_compiler.compileFromArray(program, 2)
    val HexProgram =
      accumulator.accumulator_compiler.getHexcodeProgram(UIntProgram)

    chisel3.iotesters.Driver
      .execute(Array("--backend-name", "treadle"), () => new accumulator_v2()) {
        DUT => new accumulator_v2_simulation(DUT, UIntProgram, output)
      }

    result = output.toString

    // result(n) follows filenames val order
    RunResultsV2(
      HexProgram,
      result
    )
  }
}

class accumulator_v1_simulation(
    DUT: accumulator.accumulator_v1.accumulator_v1,
    program: Array[UInt],
    output: StringWriter
) extends PeekPokeTester(DUT) {
  var instructionsArray = program

  step(1)

  var simulation_ended = false
  var simulation_cycle = 0

  case class V1Snapshot(
      mem: Array[BigInt],
      pc: BigInt,
      acc: BigInt,
      ir: BigInt,
      state: BigInt,
      stimMem: BigInt,
      stimLine: Int
  )
  val snapshots = scala.collection.mutable.ArrayBuffer[V1Snapshot]()

  while (!simulation_ended) {
    val stateVal = peek(DUT.io.State)
    val irVal = peek(DUT.io.IR)
    val instrVal = peek(DUT.io.Instruction)
    val accVal = peek(DUT.io.ACC.asSInt())

    snapshots += V1Snapshot(
      mem = DUT.io.InternalMemory.map(peek(_)).toArray,
      pc = peek(DUT.io.PC),
      acc = accVal,
      ir = irVal,
      state = stateVal,
      stimMem = peek(DUT.io.StimulatedMemoryCell),
      stimLine = accumulator_v1_compiler.getStimulatedLines(
        instrVal.toInt,
        stateVal.toInt,
        accVal
      )
    )

    step(1)
    simulation_cycle += 1
    simulation_ended =
      (instrVal.toInt == 5 && stateVal.toInt == 0) || (simulation_cycle == SimulationConfig.MaxCycles)
  }

  val sb = new StringBuilder(snapshots.size * 512)
  sb.append("{\"imState\":[],\"steps\":[")
  snapshots.zipWithIndex.foreach { case (s, idx) =>
    sb.append("{")
    sb.append("\"memoryState\":[").append(s.mem.mkString(",")).append("],")
    sb.append("\"pcState\":").append(s.pc).append(",")
    sb.append("\"accState\":").append(s.acc).append(",")
    sb.append("\"irState\":").append(s.ir).append(",")
    sb.append("\"instructionState\":").append(s.state).append(",")
    sb.append("\"stimulatedMemory\":").append(s.stimMem).append(",")
    sb.append("\"stimulatedLineState\":").append(s.stimLine)
    sb.append("}")
    if (idx < snapshots.size - 1) sb.append(",")
  }
  sb.append("]}")
  output.write(sb.toString)
  output.flush()
}

class accumulator_v2_simulation(
    DUT: accumulator.accumulator_v2.accumulator_v2,
    program: Array[UInt],
    output: StringWriter
) extends PeekPokeTester(DUT) {

  var instructionsArray = program

  for (idx <- 0 until instructionsArray.length) {
    poke(DUT.io.InputMemory(idx), instructionsArray(idx))
  }
  step(256)

  var simulation_ended = false
  var simulation_cycle = 0

  case class V2Snapshot(
      mem: Array[BigInt],
      pc: BigInt,
      acc: BigInt,
      ir: BigInt,
      ma: BigInt,
      state: BigInt,
      stimMem: BigInt,
      stimLine: Int
  )
  val snapshots = scala.collection.mutable.ArrayBuffer[V2Snapshot]()

  while (!simulation_ended) {
    val stateVal = peek(DUT.io.State)
    val instrVal = peek(DUT.io.Instruction)
    val accVal = peek(DUT.io.ACC.asSInt())

    snapshots += V2Snapshot(
      mem = DUT.io.InternalMemory.map(peek(_)).toArray,
      pc = peek(DUT.io.PC),
      acc = accVal,
      ir = peek(DUT.io.IR),
      ma = peek(DUT.io.MA),
      state = stateVal,
      stimMem = peek(DUT.io.StimulatedMemoryCell),
      stimLine = accumulator_v2_compiler.getStimulatedLines(
        instrVal.toInt,
        stateVal.toInt,
        accVal
      )
    )

    step(1)
    simulation_cycle += 1
    simulation_ended =
      (instrVal.toInt == 19 && stateVal.toInt == 0) || (simulation_cycle == SimulationConfig.MaxCycles)
  }

  val sb = new StringBuilder(snapshots.size * 512)
  sb.append("{\"imState\":[],\"steps\":[")
  snapshots.zipWithIndex.foreach { case (s, idx) =>
    sb.append("{")
    sb.append("\"memoryState\":[").append(s.mem.mkString(",")).append("],")
    sb.append("\"pcState\":").append(s.pc).append(",")
    sb.append("\"accState\":").append(s.acc).append(",")
    sb.append("\"irState\":").append(s.ir).append(",")
    sb.append("\"ma\":").append(s.ma).append(",")
    sb.append("\"instructionState\":").append(s.state).append(",")
    sb.append("\"stimulatedMemory\":").append(s.stimMem).append(",")
    sb.append("\"stimulatedLineState\":").append(s.stimLine)
    sb.append("}")
    if (idx < snapshots.size - 1) sb.append(",")
  }
  sb.append("]}")
  output.write(sb.toString)
  output.flush()
}

object exec extends App {
  // accumulator_execs.runCompileFromFilename("./programs_files/target_program_acc.txt", 2)
  // accumulator_execs.runCompileFromFilename("./programs_files/dummy_program_01.txt", 1)
  val program = accumulator.accumulator_compiler.readProgramFromFile(
    "./programs_files/target_program_v2_shifts.txt"
  )
  System.out.println(program.mkString(" "))
  accumulator.execs.accumulator_execs.compileAndRunV2(program)
}
