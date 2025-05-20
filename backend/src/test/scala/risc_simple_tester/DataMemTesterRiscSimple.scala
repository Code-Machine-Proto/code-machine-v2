package risc_simple

import chisel3._
import chisel3.iotesters._

import risc_simple.program._

class DataMemTesterRiscSimple(DUT: DataMem) extends PeekPokeTester(DUT){ 

  val Data_mem = Vec(256,UInt(16.W))
  for (i <- 0 until 6 ){   
    poke(DUT.io.addr, i)
    step(1)
    peek(DUT.io.data_out)
  }
}
/*
object DataMemTesterRiscSimple extends App{
chisel3.iotesters.Driver.execute(
Array("--generate-vcd-output","on"),
() => new DataMem(Assembler.data)) {
DUT => new DataMemTesterRiscSimple(DUT)}
}
*/
