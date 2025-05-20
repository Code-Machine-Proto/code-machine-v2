package risc_v_patterson.components

import chisel3._

class RegistersWriteDataSlicer extends Module{
  val io = IO(new Bundle {
    val LoadType = Input(UInt(3.W))
    val InputData = Input(SInt(32.W))
    val OutputData = Output(SInt(32.W))
  })

  val OutputDataWire = WireInit(0.S(32.W))
  val loadTypes = risc_v_patterson.commons.loadTypes

  when(io.LoadType === loadTypes("byte").U){
    OutputDataWire := (io.InputData.asUInt() & 255.U).asSInt()
  }.elsewhen(io.LoadType === loadTypes("halfword").U){
    OutputDataWire := (io.InputData.asUInt() & 65535.U).asSInt()
  }.elsewhen(io.LoadType === loadTypes("word").U){
    OutputDataWire := io.InputData
  }

  io.OutputData := OutputDataWire
}
