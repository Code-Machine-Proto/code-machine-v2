package risc_simple

import chisel3.iotesters._

import java.io.FileWriter
import scala.io.Source

// need further dev : stimulated lines

final case class RunResultsRiscSimple  (
                               hex_text: Array[String],
                               hex_data: Array[String],
                               dm_status: Array[String],
                               reg_status: Array[String],
                               pc_status: Array[String],
                               ir_status: Array[String],
                               state_status: Array[String],
                               lines_status: Array[String],
                               //im_status: Array[String],
                             )

object risc_simple_execs {

  def compileAndRun(program: Array[String], id: Int): RunResultsRiscSimple = {
  
    var result = Array[Array[String]]()
    val filenames = Array[String](
      "./output_files/risc_simple_dm_status_" + id + ".txt",
      "./output_files/risc_simple_reg_status" + id + ".txt",
      "./output_files/risc_simple_pc_status" + id + ".txt",
      "./output_files/risc_simple_ir_status" + id + ".txt",
      "./output_files/risc_simple_state_status" + id + ".txt",
      "./output_files/risc_simple_stimulated_lines_status" + id + ".txt"
      //"./output_files/risc_simple_im_status" + id + ".txt"
    )
    

    val UIntText = risc_simple.compiler.asm_compiler.compileFromArray_text(program) //UInt text
    val UIntData = risc_simple.compiler.asm_compiler.compileFromArray_data(program) //UInt data
    
    val Hextext = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntText)
    val Hexdata = risc_simple.compiler.asm_compiler.getHexcodeProgram(UIntData)
    
    System.out.println(Hextext.mkString(" "))          //Dev. 
    System.out.println(Hexdata.mkString(" "))          //Dev.

    
    chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new RiscSimple(UIntText,UIntData)) {
      DUT => new risc_simple_simulation(DUT, id)
    }

    for(sourcefile <- filenames){
      var content = Array[String]()
      for(line <- Source.fromFile(sourcefile).getLines){
        content = content :+ line
      }
      result = result :+ content
    }

    // result(n) follows filenames val order
    RunResultsRiscSimple(
      Hextext,
      Hexdata,
      result(0),
      result(1),
      result(2),
      result(3),
      result(4),
      result(5)
      //result(6)
    )
  }
}

class risc_simple_simulation(DUT: risc_simple.RiscSimple, id: Int) extends PeekPokeTester(DUT) {

  val output_dm = new FileWriter("./output_files/risc_simple_dm_status_" + id + ".txt", false);
  val output_reg = new FileWriter("./output_files/risc_simple_reg_status" + id + ".txt", false);
  val output_pc = new FileWriter("./output_files/risc_simple_pc_status" + id + ".txt", false);
  val output_ir = new FileWriter("./output_files/risc_simple_ir_status" + id + ".txt", false);
  val output_state = new FileWriter("./output_files/risc_simple_state_status" + id + ".txt", false);
  val output_stimulated_lines = new FileWriter("./output_files/risc_simple_stimulated_lines_status" + id + ".txt", false);
  //val output_im = new FileWriter("./output_files/risc_simple_im_status_" + id + ".txt", false);

  var simulation_ended = false
  var simulation_cycle = 0

  while(!simulation_ended){
  
// --------- DM
  
    for(memIdx <- 0 until DUT.io.debug.Data_mem.length){
    
      if(memIdx < DUT.io.debug.Data_mem.length - 1){
        output_dm.write(peek(DUT.io.debug.Data_mem(memIdx)).toString + ",")
      }
      else{
        output_dm.write(peek(DUT.io.debug.Data_mem(memIdx)).toString + "\r")
      }
      output_dm.flush()
    }
    
    output_dm.write("\n")
    output_dm.flush()
    
// ---------  Reg
 
    for(memIdx <- 0 until DUT.io.debug.Registers.length){
    
      if(memIdx < DUT.io.debug.Registers.length - 1){
        output_reg.write(peek(DUT.io.debug.Registers(memIdx)).toString + ",")
      }
      else{
        output_reg.write(peek(DUT.io.debug.Registers(memIdx)).toString + "\r")
      }
      output_reg.flush()
    }
    
    output_reg.write("\n")
    output_reg.flush()
        
// ---------- PC
 
    output_pc.write(peek(DUT.io.debug.PC).toString + "\n")
    output_pc.flush()

// ----------- IR

    output_ir.write(peek(DUT.io.debug.IR).toString + "\n")
    output_ir.flush()
    
// ----------- State

    output_state.write(peek(DUT.io.debug.State).toString + "\n")
    output_state.flush()
    
// ----------- Stimulated lines

    val stimulatedLines = risc_simple.compiler.asm_compiler.getStimulatedLines(peek(DUT.io.debug.Instruction).toInt, peek(DUT.io.debug.State).toInt)

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

//------- IM (If needed )
   /*
    for(memIdx <- 0 until DUT.io.debug.Inst_mem.length){
    
      if(memIdx < DUT.io.debug.Inst_mem.length - 1){
        output_im.write(peek(DUT.io.debug.Inst_mem(memIdx)).toString + ",")
      }
      else{
        output_im.write(peek(DUT.io.debug.Inst_mem(memIdx)).toString + "\r")
      }
      output_im.flush()
    }
    
    output_im.write("\n")
    output_im.flush()
  */

    step(1)

    simulation_cycle = simulation_cycle + 1    //Debug. purposes
    simulation_ended = (peek(DUT.io.debug.State).toInt == 4) || (simulation_cycle == 512)
  }
}

object exec extends App {
  val program = risc_simple.compiler.asm_compiler.readProgramFromFile("./programs_files/fibo.txt")
  System.out.println(program.mkString(" "))
  risc_simple.risc_simple_execs.compileAndRun(program, 112233)
}
