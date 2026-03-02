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

    chisel3.iotesters.Driver.execute(
      Array("--generate-vcd-output", "on"),
      () => new RiscSimple(UIntText, UIntData)
    ) { DUT =>
      new risc_simple_simulation(DUT, output, UIntText, UIntData)
    }

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

  // Software mirrors since memory doesn't change
  val imSnapshot = prog.map(_.litValue).toArray.padTo(4096, BigInt(0))
  val dmSnapshot = data.map(_.litValue).toArray.padTo(256, BigInt(0))

  var simulation_ended = false
  var simulation_cycle = 0
  output.write("[")
  output.flush()
  step(1)
  while (!simulation_ended) {
    output.write("{")
    output.flush()

// --------- DM — now read from dmSnapshot instead of hardware
    output.write("\"memoryState\" : [")
    for (memIdx <- 0 until dmSnapshot.length) {
      if (memIdx < dmSnapshot.length - 1) {
        output.write(dmSnapshot(memIdx).toString + ",")
      } else {
        output.write(dmSnapshot(memIdx).toString + "\r")
      }
    }
    output.write("],")
    output.flush()

// --------- Reg
    output.write("\"regState\" : [")
    for (memIdx <- 0 until DUT.io.debug.Registers.length) {
      if (memIdx < DUT.io.debug.Registers.length - 1) {
        output.write(peek(DUT.io.debug.Registers(memIdx)).toString + ",")
      } else {
        output.write(peek(DUT.io.debug.Registers(memIdx)).toString + "\r")
      }
    }
    output.write("],")
    output.flush()

// ---------- PC, IR, State, FlagNZ — peek once, reuse
    val pcVal = peek(DUT.io.debug.PC)
    val irVal = peek(DUT.io.debug.IR)
    val stateVal = peek(DUT.io.debug.State)
    val flagVal = peek(DUT.io.debug.FlagNZ)

    output.write("\"pcState\" : " + pcVal.toString + ",")
    output.flush()
    output.write("\"irState\" : " + irVal.toString + ",")
    output.flush()
    output.write("\"instructionState\" : " + (stateVal - 1).toString + ",")
    output.flush()
    output.write(
      "\"stimulatedLineState\" : " + risc_simple.compiler.asm_compiler
        .getStimulatedLines(irVal.toInt, stateVal.toInt, flagVal.toInt) + ","
    )

// --------- IM — read from imSnapshot instead of hardware
    output.write("\"imState\" : [")
    for (memIdx <- 0 until imSnapshot.length) {
      if (memIdx < imSnapshot.length - 1) {
        output.write(imSnapshot(memIdx).toString + ",")
      } else {
        output.write(imSnapshot(memIdx).toString + "\r")
      }
    }
    output.write("]")
    output.write("},")
    output.flush()

    step(1)
    simulation_cycle += 1
    simulation_ended = (stateVal.toInt == 4) || (simulation_cycle == 1024)
  }
  output.write("]")
  output.flush()
}

object exec extends App {
  val program = risc_simple.compiler.asm_compiler.readProgramFromFile(
    "./programs_files/fibo.txt"
  )
  System.out.println(program.mkString(" "))
  risc_simple.risc_simple_execs.compileAndRun(program)
}
