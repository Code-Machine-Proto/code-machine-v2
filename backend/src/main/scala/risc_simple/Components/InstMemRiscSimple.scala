package risc_simple

import chisel3._
import chisel3.util._
import chisel3.util.experimental.loadMemoryFromFile
import chisel3.UInt

import risc_simple.program._

class InstMem(prog:Array[UInt]) extends Module {
  val io = IO(new Bundle {
    val addr = Input(UInt(12.W))     
    val inst = Output(UInt(28.W))
    
    //for debug purposes.
    val Sim_InstMemoryOut = Output(Vec(4096,UInt(28.W)))
  })
  
  // Debug output init
  io.Sim_InstMemoryOut := RegInit(VecInit(Seq.fill(4096)(0.U(28.W))))
  
  // Memory def
//  val instMem = SyncReadMem(4096,UInt(28.W))
  val instMem = RegInit(VecInit(Seq.fill(4096)(0.U(28.W))))

  
  // Load
  val Done = RegInit(0.B)
  val InstructionOutWire = WireDefault(0.U(28.W))
  
  when(Done =/= 1.B){
    for (i <- 0 until prog.length){
      // instMem.write(i.asUInt(),prog(i).asUInt())
      instMem(i) := prog(i)
    }
     Done := 1.B
  }
  
  .otherwise{
  InstructionOutWire := instMem(io.addr)
  }
  
  // Default Memory output
  io.inst := InstructionOutWire
  
  //Debug : if IM debug is needed
  
  for (idx <- 0 until 256){
      //io.Sim_InstMemoryOut(idx) := instMem.read(idx.asUInt())
    io.Sim_InstMemoryOut(idx) := instMem(idx)
  }
  
}
