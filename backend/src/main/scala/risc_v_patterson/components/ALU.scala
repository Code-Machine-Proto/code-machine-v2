package risc_v_patterson.components

import chisel3._

class ALU extends Module{

  val operations = risc_v_patterson.commons.operations

  val io = IO(new Bundle {
    val Source_1 = Input(SInt(32.W))
    val Source_2 = Input(SInt(32.W))

    val Operation = Input(UInt(4.W))

    val Result = Output(SInt(32.W))

    val Zero = Output(Bool())
    val Positive = Output(Bool())
  })

  val ZeroWire = WireInit(0.B)
  val ResultWire = WireInit(0.S(32.W))

  when(io.Operation === operations("add").U){
    ResultWire := io.Source_1 + io.Source_2
  }.elsewhen(io.Operation === operations("subtract").U){
    ResultWire := io.Source_1 - io.Source_2;
  }.elsewhen(io.Operation === operations("AND").U){
    ResultWire := io.Source_1 & io.Source_2
  }.elsewhen(io.Operation === operations("OR").U){
    ResultWire := io.Source_1 | io.Source_2
  }.elsewhen(io.Operation === operations("XOR").U){
    ResultWire := io.Source_1 ^ io.Source_2
  }.elsewhen(io.Operation === operations("sll").U){
    ResultWire := io.Source_1 << (io.Source_2.asUInt() % 32.U)
  }.elsewhen(io.Operation === operations("sra").U){
    ResultWire := io.Source_1 >> (io.Source_2.asUInt() % 32.U)
  }

  io.Result := ResultWire

  io.Zero := (ResultWire === 0.S)
  io.Positive := (ResultWire > 0.S)
}
