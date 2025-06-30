package risc_simple

import chisel3.iotesters._

import java.io.StringWriter
import scala.io.Source

// need further dev : stimulated lines

object RiscSimpleFilePath {
  val path = "./output_files/output_risc_simple.txt"
}


final case class RunResultsRiscSimple  (
                               hex_text: Array[String],
                               hex_data: Array[String],
                               output: String,
                             )

object risc_simple_execs {

  def compileAndRun(program: Array[String]): RunResultsRiscSimple = {
  
    var result = ""
    val output = new StringWriter()

    val UIntText = risc_simple.compiler.asm_compiler.compileFromArray_text(program) //UInt text
    val UIntData = risc_simple.compiler.asm_compiler.compileFromArray_data(program) //UInt data
    
    val Hextext = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntText)
    val Hexdata = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntData)
    
    System.out.println(Hextext.mkString(" "))          //Dev. 
    System.out.println(Hexdata.mkString(" "))          //Dev.

    
    chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new RiscSimple(UIntText,UIntData)) {
      DUT => new risc_simple_simulation(DUT, output)
    }

    result = output.toString


    // result(n) follows filenames val order
    RunResultsRiscSimple(
      Hextext,
      Hexdata,
      result,
    )
  }
}

class risc_simple_simulation(DUT: risc_simple.RiscSimple, output: StringWriter) extends PeekPokeTester(DUT) {


  var simulation_ended = false
  var simulation_cycle = 0

  output.write("[")
  output.flush()
  step(1)
  while(!simulation_ended){
    output.write("{")
    output.flush()


// --------- DM
    output.write("\"memoryState\" : [")
    for(memIdx <- 0 until DUT.io.debug.Data_mem.length){
    
      if(memIdx < DUT.io.debug.Data_mem.length - 1){
        output.write(peek(DUT.io.debug.Data_mem(memIdx)).toString + ",")
      }
      else{
        output.write(peek(DUT.io.debug.Data_mem(memIdx)).toString + "\r")
      }
    }
    output.write("],")
    output.flush()
    
// ---------  Reg
    output.write("\"regState\" : [")
    for(memIdx <- 0 until DUT.io.debug.Registers.length){
    
      if(memIdx < DUT.io.debug.Registers.length - 1){
        output.write(peek(DUT.io.debug.Registers(memIdx)).toString + ",")
      }
      else{
        output.write(peek(DUT.io.debug.Registers(memIdx)).toString + "\r")
      }
    }
    output.write("],")
    output.flush()
        
// ---------- PC
    output.write("\"pcState\" : " + peek(DUT.io.debug.PC).toString + ",")
    output.flush()

// ----------- IR
    output.write("\"irState\" : " + peek(DUT.io.debug.IR).toString + ",")
    output.flush()
    
// ----------- State
    output.write("\"instructionState\" : " + (peek(DUT.io.debug.State)-1).toString + ",")
    output.flush()
    
// ----------- Stimulated lines

  //TODO: complete -- Check la valeur pendant le debug
  output.write("\"stimulatedLineState\" : " + risc_simple.compiler.asm_compiler.getStimulatedLines(peek(DUT.io.debug.IR).toInt,peek(DUT.io.debug.State).toInt, peek(DUT.io.debug.FlagNZ).toInt) + ",")
//------- IM (If needed )
  output.write("\"imState\" : [")
  for(memIdx <- 0 until DUT.io.debug.Inst_mem.length){
  
    if(memIdx < DUT.io.debug.Inst_mem.length - 1){
      output.write(peek(DUT.io.debug.Inst_mem(memIdx)).toString + ",")
    }
    else{
      output.write(peek(DUT.io.debug.Inst_mem(memIdx)).toString + "\r")
    }
  }
  output.write("]")

  
  output.write("},")
  output.flush()
    step(1)

    simulation_cycle = simulation_cycle + 1    //Debug. purposes
    simulation_ended = (peek(DUT.io.debug.State).toInt == 4) || (simulation_cycle == 1024)
  }
  output.write("]")
  output.flush()
}

object exec extends App {
  val program = risc_simple.compiler.asm_compiler.readProgramFromFile("./programs_files/fibo.txt")
  System.out.println(program.mkString(" "))
  risc_simple.risc_simple_execs.compileAndRun(program)
}
