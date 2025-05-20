package risc_simple

import chisel3._

class BlocReg() extends Module {
  val io = IO(new Bundle {   
    val data_in = Input(SInt(16.W))    //
    val rdst    = Input(UInt(5.W))     
    val rsrc1   = Input(UInt(5.W))    
    val rsrc2   = Input(UInt(5.W))    
    val wreg    = Input(Bool())      
    
    val a = Output(SInt(16.W))   //
    val b = Output(SInt(16.W))   //
    
    //debug: Registers check
    val Sim_RegistersVec = Output(Vec(32,SInt(16.W)))   
  })
  
  // Default output values
  io.a := 0.S   //
  io.b := 0.S   //
              
  // Inupt variables
  val wreg = io.wreg  
  val rdst = io.rdst
  val rsrc1 = io.rsrc1
  val rsrc2 = io.rsrc2
  val data_in = io.data_in
  
  // Bank of registers
  val regVec = RegInit(VecInit(Seq.fill(32)(0.S(16.W))))        //

  // logic
  when(wreg){
    regVec(rdst) := data_in
  }
  
  io.a := regVec(rsrc1)
  io.b := regVec(rsrc2)
  io.Sim_RegistersVec := regVec
}
