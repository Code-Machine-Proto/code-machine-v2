package risc_simple

import chisel3._
import chisel3.util._

import risc_simple.shared.Op_inst._
import risc_simple.shared.Op_alu._
import risc_simple.shared.Constants._

class DecodeOut extends Bundle {
  val op_type          = UInt()
  val wreg             = Bool()
  val wmem             = Bool()
  val ena              = Bool()
  val choixSource      = UInt(2.W)
  val doBranch         = Bool()
}

object DecodeOut {

  def default: DecodeOut = {         
    val v = Wire(new DecodeOut)      
    v.op_type          := stope 
    v.choixSource      := 3.U           // by default , linked to nothing
    v.wreg             := false.B
    v.wmem             := false.B
    v.ena              := false.B
    v.doBranch         := false.B
    
    v                               
  }
}

class Decode() extends Module {

  val io = IO(new Bundle { 
    val instr_in   = Input(UInt(28.W))               
    val decode_out = Output(new DecodeOut)       
  })

  // Default output values
  val d = DecodeOut.default 
  
  //input variables
  val instr_in = io.instr_in 
  
  //variables
  val isAlu = instr_in(27) 
  val isOther = instr_in(27, 24)          
  
  //logic
  when (isAlu === 0.U){
      d.op_type := alu
      d.choixSource := 0.U
      d.wreg := true.B  
      d.ena := true.B
  }  
    
  switch(isOther) { 
    is(RM.U) {
      d.op_type := rm
      d.choixSource := 1.U
      d.wreg := true.B                
    }
    is(WM.U) {
      d.op_type := wm
      d.wmem := true.B
    }
    is(LDI.U) {
      d.op_type := ldi
      d.choixSource := 2.U
      d.wreg := true.B              
    }
    is(BRANCH.U) {
      d.op_type := branch
      d.doBranch := true.B
    }
    is(STOP.U) {
      d.op_type := stope
    }
  }
  io.decode_out := d             
}
