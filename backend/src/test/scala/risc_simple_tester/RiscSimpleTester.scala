package risc_simple

import chisel3._
import chisel3.iotesters._

import java.io.FileWriter

import risc_simple.shared.Op_inst._
import risc_simple.shared.Constants._
import risc_simple.shared.Op_alu._
import risc_simple.program._
import risc_simple.compiler.asm_compiler._

object Compile extends App {

  val filename = "./programs_files/program_risc_1.txt";
  val backend_text = compile_for_backend_text(filename)   //UInt
  val backend_data = compile_for_backend_data(filename)   //UInt


}

class RiscSimpleTester(DUT: RiscSimple) extends PeekPokeTester(DUT){   


    step(100)
    
    
}

/*
object RiscSimpleTester extends App{
chisel3.iotesters.Driver.execute(
Array("--generate-vcd-output","on"),
() => new RiscSimple(Compile.backend_text,Compile.backend_data)) {
DUT => new RiscSimpleTester(DUT)}
}

*/
