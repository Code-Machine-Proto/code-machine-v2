package risc_v_patterson.components

import Chisel.Cat
import chisel3._

class DataMemory extends Module{
  val io = IO(new Bundle {
    val Address = Input(UInt(10.W))
    val WriteData = Input(SInt(32.W))

    val MemWrite = Input(Bool())
    val MemWriteSize = Input(UInt(3.W))

    val MemRead = Input(Bool())

    val Sim_StopLoading = Input(Bool())
    val Sim_DataSize = Input(UInt(3.W))
    val Sim_DataIn = Input(SInt(32.W))
    val Sim_DataMemoryLoaded = Output(Bool())

    val ReadData = Output(SInt(32.W))
    val db_InternalMemory = Output(Vec(risc_v_patterson.commons.dataMemorySize, SInt(32.W)))
  })

  val InternalMemory = RegInit(VecInit(Seq.fill(risc_v_patterson.commons.dataMemorySize)(0.S(8.W))))
  val MemoryLoadingIdx = RegInit(0.U(10.W))

  val ReadDataWire = WireInit(0.S(32.W))
  val MemoryLoaded = RegInit(0.B)

  when(MemoryLoaded === 0.B){

    InternalMemory(MemoryLoadingIdx) := io.Sim_DataIn(7, 0).asSInt()

    when(io.Sim_DataSize === 1.U || io.Sim_DataSize === 2.U){
      when(MemoryLoadingIdx + 1.U < risc_v_patterson.commons.dataMemorySize.U){
        InternalMemory(MemoryLoadingIdx + 1.U) := io.Sim_DataIn(15, 8).asSInt()
      }
    }

    when(io.Sim_DataSize === 2.U){
      when(MemoryLoadingIdx + 2.U < risc_v_patterson.commons.dataMemorySize.U){
        InternalMemory(MemoryLoadingIdx + 2.U) := io.Sim_DataIn(23, 16).asSInt()
      }
      when(MemoryLoadingIdx + 3.U < risc_v_patterson.commons.dataMemorySize.U){
        InternalMemory(MemoryLoadingIdx + 3.U) := io.Sim_DataIn(31, 24).asSInt()
      }
    }

    MemoryLoadingIdx := MemoryLoadingIdx + io.Sim_DataSize + 1.U

    MemoryLoaded := (io.Sim_StopLoading) || (MemoryLoadingIdx >= (risc_v_patterson.commons.dataMemorySize.U - 1.U))

  }.otherwise{

    when(io.MemWrite){
      InternalMemory(io.Address) := io.WriteData(7, 0).asSInt()
      when(io.MemWriteSize === 1.U || io.MemWriteSize === 2.U){
        InternalMemory(io.Address + 1.U) := io.WriteData(15, 8).asSInt()
      }
      when(io.MemWriteSize === 2.U){
        InternalMemory(io.Address + 2.U) := io.WriteData(23, 16).asSInt()
        InternalMemory(io.Address + 3.U) := io.WriteData(31, 24).asSInt()
      }
    }

    when(io.MemRead === 1.B){
      ReadDataWire := Cat(InternalMemory(io.Address + 3.U), Cat(InternalMemory(io.Address + 2.U), Cat(InternalMemory(io.Address + 1.U), InternalMemory(io.Address)))).asSInt()
    }

  }
  io.ReadData := ReadDataWire
  io.db_InternalMemory := InternalMemory
  io.Sim_DataMemoryLoaded := MemoryLoaded
}
