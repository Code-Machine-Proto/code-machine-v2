package risc_v_patterson.components

import chisel3._
import chisel3.util._

class ImmGen extends Module {
  val io = IO(new Bundle{
    val InstructionIn = Input(UInt(32.W))
    val ImmOut = Output(SInt(32.W))
  })

  val InstructionInBools = VecInit(io.InstructionIn.asBools)
  val ImmOutBools = VecInit(0.U(32.W).asBools)

  when(io.InstructionIn(6, 0) === risc_v_patterson.commons.opcodes("Register").U){
    ImmOutBools := VecInit(0.U(32.W).asBools)
  }.elsewhen(io.InstructionIn(6, 0) === risc_v_patterson.commons.opcodes("Load").U){
    // Sign extension
    for(i <- 12 to 31)
      ImmOutBools(i) := InstructionInBools(31)
    for(i <- 0 to 11)
      ImmOutBools(i) := InstructionInBools(20 + i)
  }.elsewhen(io.InstructionIn(6, 0) === risc_v_patterson.commons.opcodes("Store").U){
    // Sign extension
    for(i <- 12 to 31)
      ImmOutBools(i) := InstructionInBools(31)
    for(i <- 0 to 6)
      ImmOutBools(5 + i) := InstructionInBools(25 + i)
    for(i <- 0 to 4)
      ImmOutBools(i) := InstructionInBools(7 + i)
  }.elsewhen(io.InstructionIn(6, 0) === risc_v_patterson.commons.opcodes("Branch").U){
    // CF: https://github.com/johnwinans/rvalp/releases , page 56 of 81
    // Sign extension
    for(i <- 12 to 31)
      ImmOutBools(i) := InstructionInBools(31)
    ImmOutBools(11) := InstructionInBools(7)
    for(i <- 0 to 5)
      ImmOutBools(5 + i) := InstructionInBools(25 + i)
    for(i <- 0 to 3)
      ImmOutBools(1 + i) := InstructionInBools(8 + i)
    ImmOutBools(0) := 0.B
  }

  io.ImmOut := ImmOutBools.asUInt.asSInt()
}


