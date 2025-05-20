package risc_simple

import chisel3.{UInt, _}

class DataMem(data:Array[UInt]) extends Module {
  val io = IO(new Bundle {   
    val addr    = Input(UInt(8.W))    
    val data_in = Input(SInt(16.W))     //
    val wmem    = Input(Bool())     
    
    val data_out = Output(SInt(16.W))     //
    //for debug :The compiler loading DM 
    val Sim_DataMemoryOut = Output(Vec(256,SInt(16.W)))         //
  })
  
  // Debug output init
  io.Sim_DataMemoryOut := RegInit(VecInit(Seq.fill(256)(0.S(16.W))))   //
  
  //Memory def
  // val dataMem = SyncReadMem(256,SInt(16.W))    //
  val dataMem = RegInit(VecInit(Seq.fill(256)(0.S(16.W))))
  
  //Memory load
  val Done = RegInit(0.B)
  val DataOutWire = WireDefault(0.S(16.W))    //
  
  when(Done =/= 1.B){
    for (i <- 0 until data.length){
      //dataMem.write(i.asUInt(),data(i).asSInt())
      dataMem(i) := data(i).asSInt()
    }
    Done := 1.B
  }
  .otherwise{
  DataOutWire := dataMem(io.addr)
  }
  
  //Memory write
  when(io.wmem){
    dataMem(io.addr) := io.data_in
  }
  
  //Default Memory output
  io.data_out := DataOutWire
  
  //Debug
  for (idx <- 0 until 256){
      //io.Sim_DataMemoryOut(idx) := dataMem.read(idx.asUInt())
    io.Sim_DataMemoryOut(idx) := dataMem(idx)
  }
}
