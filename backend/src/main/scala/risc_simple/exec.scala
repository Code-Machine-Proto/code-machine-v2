package risc_simple

import chisel3.iotesters._

import java.io.StringWriter
import scala.io.Source
import chisel3.UInt

// need further dev : stimulated lines

object RiscSimpleFilePath {
  val path = "./output_files/output_risc_simple.txt"
}

final case class RunResultsRiscSimple(
    hex_text: Array[String],
    hex_data: Array[String],
    output: String
)

object risc_simple_execs {

  def compileAndRun(program: Array[String]): RunResultsRiscSimple = {
    val start = System.nanoTime()
    var result = ""
    val output = new StringWriter()

    val UIntText = risc_simple.compiler.asm_compiler.compileFromArray_text(
      program
    ) // UInt text
    val UIntData = risc_simple.compiler.asm_compiler.compileFromArray_data(
      program
    ) // UInt data

    val Hextext = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntText)
    val Hexdata = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntData)

    System.out.println(Hextext.mkString(" ")) // Dev.
    System.out.println(Hexdata.mkString(" ")) // Dev.

    val startTime = System.currentTimeMillis()

    chisel3.iotesters.Driver.execute(
      Array("--generate-vcd-output", "off"),
      () => {
        new RiscSimple(UIntText, UIntData)
      }
    ) { DUT =>
      new risc_simple_simulation(DUT, output, UIntText, UIntData)
    }

    println(s"Total time: ${System.currentTimeMillis() - startTime}ms")
    System.out.flush()

    result = output.toString

    val end = System.nanoTime()
    val durationMs = (end - start) / 1000000
    println(f"[PolyRisc] took $durationMs%.3f ms")

    // result(n) follows filenames val order
    RunResultsRiscSimple(
      Hextext,
      Hexdata,
      result
    )
  }
}

class risc_simple_simulation(
    DUT: risc_simple.RiscSimple,
    output: StringWriter,
    prog: Array[UInt],
    data: Array[UInt]
) extends PeekPokeTester(DUT) {

  // To collect data
  case class CycleSnapshot(
      memoryState: Array[BigInt],
      regState: Array[BigInt],
      pcState: BigInt,
      irState: BigInt,
      instructionState: BigInt,
      stimulatedLine: Int
  )

  // Software mirror so no hardware peeking is needed for instruciton memory
  val imSnapshot = prog.map(_.litValue).toArray.padTo(4096, BigInt(0))

  val snapshots = scala.collection.mutable.ArrayBuffer[CycleSnapshot]()

  step(1)

  var simulation_ended = false
  var simulation_cycle = 0

  while (!simulation_ended) {
    val stateVal = peek(DUT.io.debug.State)
    val irVal = peek(DUT.io.debug.IR)
    val flagVal = peek(DUT.io.debug.FlagNZ)

    snapshots += CycleSnapshot(
      memoryState = DUT.io.debug.DataMemory.map(peek(_)).toArray,
      regState = DUT.io.debug.Registers.map(peek(_)).toArray,
      pcState = peek(DUT.io.debug.PC),
      irState = irVal,
      instructionState = stateVal - 1,
      stimulatedLine = risc_simple.compiler.asm_compiler
        .getStimulatedLines(irVal.toInt, stateVal.toInt, flagVal.toInt)
    )

    step(1)
    simulation_cycle += 1
    simulation_ended = (stateVal.toInt == 4) || (simulation_cycle == 1024)
  }

// Serialize once
  val sb = new StringBuilder(snapshots.size * 512)
  sb.append("[")
  snapshots.zipWithIndex.foreach { case (s, idx) =>
    sb.append("{")
    sb.append("\"memoryState\" : [")
      .append(s.memoryState.mkString(","))
      .append("\r],")
    sb.append("\"regState\" : [")
      .append(s.regState.mkString(","))
      .append("\r],")
    sb.append("\"pcState\" : ").append(s.pcState).append(",")
    sb.append("\"irState\" : ").append(s.irState).append(",")
    sb.append("\"instructionState\" : ").append(s.instructionState).append(",")
    sb.append("\"stimulatedLineState\" : ").append(s.stimulatedLine).append(",")
    sb.append("\"imState\" : [").append(imSnapshot.mkString(",")).append("]")
    sb.append("}")
    if (idx < snapshots.size - 1) sb.append(",")
  }
  sb.append("\r]")

  output.write(sb.toString)
  output.flush()
}

object exec extends App {
  val program = risc_simple.compiler.asm_compiler.readProgramFromFile(
    "./programs_files/fibo.txt"
  )
  System.out.println(program.mkString(" "))
  risc_simple.risc_simple_execs.compileAndRun(program)
}
