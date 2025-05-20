package risc_v_patterson.components

import chisel3._

class Registers extends Module {
  val io = IO(new Bundle {

    val Sim_WriteRegister = Input(UInt(5.W))
    val Sim_WriteData = Input(SInt(32.W))
    val Sim_RegWrite = Input(Bool())

    val Sim_RegistersVec = Input(Vec(32, SInt(32.W)))

    val ReadRegister_1 = Input(UInt(5.W))
    val ReadRegister_2 = Input(UInt(5.W))

    val WriteRegister = Input(UInt(5.W))
    val WriteData = Input(SInt(32.W))

    val RegWrite = Input(Bool())

    val ReadData_1 = Output(SInt(32.W))
    val ReadData_2 = Output(SInt(32.W))

    val db_RegistersVec = Output(Vec(32, SInt(32.W)))
  })

  val RegistersVec = RegInit(VecInit(Seq.fill(32)(0.S(32.W))))

  when(io.Sim_RegWrite === 1.B){
    RegistersVec := io.Sim_RegistersVec
  }.elsewhen(io.RegWrite === 1.B){
    RegistersVec(io.WriteRegister) := io.WriteData;
  }
  io.ReadData_1 := RegistersVec(io.ReadRegister_1)
  io.ReadData_2 := RegistersVec(io.ReadRegister_2)

  io.db_RegistersVec := RegistersVec
}
