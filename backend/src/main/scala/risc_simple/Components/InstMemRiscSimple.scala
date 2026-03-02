package risc_simple

import chisel3._
import chisel3.util._
import chisel3.util.experimental.loadMemoryFromFile
import chisel3.UInt

import risc_simple.program._

class InstMem(prog: Array[UInt]) extends Module {
  val io = IO(new Bundle {
    val addr = Input(UInt(12.W))
    val inst = Output(UInt(28.W))
  })

  val instMem = VecInit(prog.toSeq ++ Seq.fill(4096 - prog.length)(0.U(28.W)))

  io.inst := instMem(io.addr)
}
