package risc_simple

import chisel3.iotesters._
import commons.SimulationConfig

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
    val totalStart = System.nanoTime()
    var result = ""
    val output = new StringWriter()

    val compileStart = System.nanoTime()
    val UIntText =
      risc_simple.compiler.asm_compiler.compileFromArray_text(program)
    val UIntData =
      risc_simple.compiler.asm_compiler.compileFromArray_data(program)
    val Hextext = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntText)
    val Hexdata = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntData)
    println(
      f"[RiscSimple] compilation:  ${(System.nanoTime() - compileStart) / 1e6}%.1f ms"
    )

    System.out.println(Hextext.mkString(" ")) // Dev.
    System.out.println(Hexdata.mkString(" ")) // Dev.

    val simStart = System.nanoTime()
    chisel3.iotesters.Driver.execute(
      Array("--generate-vcd-output", "off", "--backend-name", "treadle"),
      () => new RiscSimple(UIntText, UIntData)
    ) { DUT =>
      new risc_simple_simulation(DUT, output, UIntText, UIntData)
    }
    println(
      f"[RiscSimple] simulation:   ${(System.nanoTime() - simStart) / 1e6}%.1f ms"
    )
    System.out.flush()

    result = output.toString

    println(
      f"[RiscSimple] total:        ${(System.nanoTime() - totalStart) / 1e6}%.1f ms"
    )

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

  case class CycleSnapshot(
      memoryState: Array[BigInt],
      regState: Array[BigInt],
      pcState: BigInt,
      irState: BigInt,
      instructionState: BigInt,
      stimulatedLine: Int
  )

  val imSnapshot = prog.map(_.litValue).toArray.padTo(4096, BigInt(0))

  val snapshots = scala.collection.mutable.ArrayBuffer[CycleSnapshot]()

  // Mirrors updated after step(1) by checking what the previous execute cycle wrote
  val dmMirror = data.map(_.litValue).toArray.padTo(256, BigInt(0))
  val regMirror = Array.fill(32)(BigInt(0))
  var lastDmSnap = dmMirror.clone()
  var lastRegSnap = regMirror.clone()
  var prevStateVal = BigInt(0)
  var prevIrVal = BigInt(0)

  step(1)

  var simulation_ended = false
  var simulation_cycle = 0

  while (!simulation_ended) {
    val stateVal = peek(DUT.io.debug.State)
    val irVal = peek(DUT.io.debug.IR)
    val flagVal = peek(DUT.io.debug.FlagNZ)
    val pcVal = peek(DUT.io.debug.PC)

    // Clock edge has committed the previous cycle's write — peek only what changed
    if (prevStateVal.toInt == 3) {
      val opcode = ((prevIrVal >> 24) & 0xf).toInt
      opcode match {
        case 0x9 => // WM: peek full memory vec (rare)
          DUT.io.debug.DataMemory.zipWithIndex.foreach { case (port, i) =>
            dmMirror(i) = peek(port)
          }
          lastDmSnap = dmMirror.clone()
        case 0xc | 0xf => // BRANCH / STOP: no write
        case _         => // ALU / RM / LDI: one register written
          val rdst = ((prevIrVal >> 16) & 0x1f).toInt
          regMirror(rdst) = peek(DUT.io.debug.Registers(rdst))
          lastRegSnap = regMirror.clone()
      }
    }

    snapshots += CycleSnapshot(
      memoryState = lastDmSnap,
      regState = lastRegSnap,
      pcState = pcVal,
      irState = irVal,
      instructionState = stateVal - 1,
      stimulatedLine = risc_simple.compiler.asm_compiler
        .getStimulatedLines(irVal.toInt, stateVal.toInt, flagVal.toInt)
    )

    prevStateVal = stateVal
    prevIrVal = irVal

    step(1)
    simulation_cycle += 1
    simulation_ended =
      (stateVal.toInt == 4) || (simulation_cycle == SimulationConfig.MaxCycles)
  }

// Serialize once — imState is constant so it is hoisted outside the steps array
  val sb = new StringBuilder(snapshots.size * 512)
  sb.append("{\"imState\":[")
    .append(imSnapshot.mkString(","))
    .append("],\"steps\":[")
  snapshots.zipWithIndex.foreach { case (s, idx) =>
    sb.append("{")
    sb.append("\"memoryState\":[")
      .append(s.memoryState.mkString(","))
      .append("],")
    sb.append("\"regState\":[")
      .append(s.regState.mkString(","))
      .append("],")
    sb.append("\"pcState\":").append(s.pcState).append(",")
    sb.append("\"irState\":").append(s.irState).append(",")
    sb.append("\"instructionState\":").append(s.instructionState).append(",")
    sb.append("\"stimulatedLineState\":").append(s.stimulatedLine)
    sb.append("}")
    if (idx < snapshots.size - 1) sb.append(",")
  }
  sb.append("]}")

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
