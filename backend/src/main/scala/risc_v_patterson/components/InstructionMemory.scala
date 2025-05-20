package risc_v_patterson.components

import chisel3._

class InstructionMemory() extends Module {

  val io = IO(new Bundle {
    val ReadAddress = Input(UInt(8.W))
    val InstructionOut = Output(UInt(32.W))

    // Sim_InstructionIn is used to load instruction for simulation purposes
    val Sim_InstructionIn = Input(UInt(32.W))
    // Sim_InstructionMemoryLoaded is used to signal that the Instruction Memory has completed its loading routine for simulation purposes
    val Sim_InstructionMemoryLoaded = Output(Bool())

    val db_InternalMemory = Output(Vec(risc_v_patterson.commons.instructionMemorySize, UInt(32.W)))
  })

  val InternalMemory = RegInit(VecInit(Seq.fill(risc_v_patterson.commons.instructionMemorySize)(0.U(32.W))))
  val MemoryLoaded = RegInit(0.B)

  val MemoryLoadingIdx = RegInit(0.U(8.W))
  val InstructionOutWire = WireDefault(0.U(32.W))

  when(MemoryLoaded =/= 1.B){
    // Loading Routine
    InternalMemory(MemoryLoadingIdx) := io.Sim_InstructionIn
    MemoryLoadingIdx := MemoryLoadingIdx + 1.U
    when(MemoryLoadingIdx === (risc_v_patterson.commons.instructionMemorySize.U - 1.U)){
      MemoryLoaded := 1.B
    }
  }.otherwise {
    // Standard behavior
    InstructionOutWire := InternalMemory(io.ReadAddress)
  }

  io.InstructionOut := InstructionOutWire
  io.Sim_InstructionMemoryLoaded := MemoryLoaded
  io.db_InternalMemory := InternalMemory
}
