package risc_simple

import chisel3.util._
import chisel3.{UInt, _}
import risc_simple.shared.Op_inst._
import risc_simple.shared.State._


class Debug extends Bundle{
  val PC = UInt(12.W)
  val IR = UInt(28.W)
  val State = UInt()
  val Registers = Vec(32,SInt(16.W))
  val Data_mem = Vec(256,SInt(16.W))
  val Inst_mem = Vec(4096,UInt(28.W))
  val Instruction = UInt(3.W)
  val FlagNZ = UInt(2.W)
}

class RiscSimple(prog:Array[UInt],data:Array[UInt]) extends Module {

  val io = IO(new Bundle {     
    val debug = Output(new Debug)
  })
  
  // Registers definition
  val StateReg = RegInit(start)
  val IRReg = RegInit(0.U(28.W))
  val PCReg = RegInit(0.U(12.W))
  val FlagReg = Reg(Vec(2,Bool()))
  
  // Declaration of sub-blocks 
  val ALU  = Module(new Alu())
  val DEC  = Module(new Decode())
  val BREG = Module(new BlocReg())
  val IM   = Module(new InstMem(prog))
  val DM   = Module(new DataMem(data))
  
  // Bank of registers bloc input network
  BREG.io.rdst    := IRReg(20,16)
  BREG.io.rsrc1   := IRReg(12,8)
  BREG.io.rsrc2   := IRReg(4,0)
  BREG.io.wreg    := DEC.io.decode_out.wreg & (StateReg === execute)
  BREG.io.data_in := MuxCase(0.S, Array((DEC.io.decode_out.choixSource === 0.U & (StateReg === execute)) -> ALU.io.f,
                                        (DEC.io.decode_out.choixSource === 1.U & (StateReg === execute)) -> DM.io.data_out,
                                        (DEC.io.decode_out.choixSource === 2.U & (StateReg === execute)) -> IRReg(15,0).asSInt()))
                                        
  // ALU bloc input network
  ALU.io.a   := BREG.io.a
  ALU.io.b   := BREG.io.b
  ALU.io.op  := IRReg(26,24)
  ALU.io.ena := DEC.io.decode_out.ena
  
  // DM bloc input network
  DM.io.addr    := BREG.io.a(7,0)
  DM.io.data_in := BREG.io.b
  DM.io.wmem    := DEC.io.decode_out.wmem & (StateReg === execute)
  
  // Decode bloc input network
  DEC.io.instr_in := IRReg
  
  // IM bloc input network
  IM.io.addr := PCReg
  
  // Pipeline state transitions
  switch(StateReg) {
    is(start)   {StateReg := fetch}
    is(fetch)   {
      when (IM.io.inst(27, 24) === 0xf.U) {StateReg := end}
      .otherwise {StateReg := decode}
    }
    is(decode)  {
      StateReg := execute
    }
    is(execute) {StateReg := fetch}
    is(end)  {StateReg := end}
  }
  
  // Pipeline state operations 
  switch(StateReg) {    
    is(start) {PCReg := 0.U}
    is(fetch) {
      IRReg := IM.io.inst
    }
    is(decode){  
      when (DEC.io.decode_out.op_type === branch) {
        when ((IRReg(19,16) === 0.U) |
             (IRReg(19,16) === 1.U & FlagReg(0) === true.B)  | 
             (IRReg(19,16) === 2.U & FlagReg(0) === false.B) |
             (IRReg(19,16) === 3.U & FlagReg(1) === true.B)  |
             (IRReg(19,16) === 4.U & FlagReg(1) === false.B) )
             {
               PCReg := IRReg(11,0)
             }
      }           
     }
    is(execute) {
    PCReg := PCReg + 1.U
    FlagReg(0) := ALU.io.Z
    FlagReg(1) := ALU.io.N
    }
    is(end)  {}
  }
  
  // Debug module output
  io.debug.PC := PCReg
  io.debug.IR := IRReg
  io.debug.State := StateReg.asUInt()
  io.debug.Registers := BREG.io.Sim_RegistersVec
  io.debug.Data_mem := DM.io.Sim_DataMemoryOut
  io.debug.Inst_mem := IM.io.Sim_InstMemoryOut
  io.debug.Instruction := DEC.io.decode_out.op_type
  io.debug.FlagNZ := (ALU.io.N << 1) + (ALU.io.Z << 0)
}

/*
object RiscSimple extends App {
  (new chisel3.stage.ChiselStage).emitVerilog(new RiscSimple(Assembler.prog2))
}
*/

