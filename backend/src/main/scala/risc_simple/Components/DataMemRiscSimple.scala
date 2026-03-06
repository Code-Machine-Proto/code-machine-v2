package risc_simple

import chisel3.{UInt, _}

class DataMem(data: Array[UInt]) extends Module {
  val io = IO(new Bundle {
    val addr = Input(UInt(8.W))
    val data_in = Input(SInt(16.W))
    val wmem = Input(Bool())

    val data_out = Output(SInt(16.W))
    val Sim_MemVec = Output(Vec(256, SInt(16.W)))
  })

  val dataMem = RegInit(
    VecInit(
      data.map(_.asSInt()).toSeq ++
        Seq.fill(256 - data.length)(0.S(16.W))
    )
  )

  when(io.wmem) {
    dataMem(io.addr) := io.data_in
  }

  io.data_out := dataMem(io.addr)
  io.Sim_MemVec := dataMem
}
