package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.DataMemory

class Sim_DataMemory_test01(DUT: DataMemory) extends PeekPokeTester(DUT) {
  val array_of_testing_values_01 = Array[(Int, Int)]((14, 0), (5233, 1), (66000, 2))
  val array_of_testing_values_02 = Array[(Int, Int)]((5233, 1), (14, 0), (66000, 2))
  val array_of_testing_values_03 = Array[(Int, Int)]((66000, 2), (14, 0), (5233, 1))

  poke(DUT.io.Sim_StopLoading, 0.B)

  for(array_idx <- 0 until array_of_testing_values_01.length) {
    poke(DUT.io.Sim_DataIn, array_of_testing_values_01(array_idx)._1)
    poke(DUT.io.Sim_DataSize, array_of_testing_values_01(array_idx)._2)
    step(1)
  }

  poke(DUT.io.Sim_StopLoading, 1.B)

  step(1)

  poke(DUT.io.MemWrite, 0.B)
  poke(DUT.io.MemRead, 1.B)

  for(array_idx <- 0 until array_of_testing_values_01.length){
    poke(DUT.io.Address, array_idx.U)
    System.out.println(peek(DUT.io.ReadData).toInt.toBinaryString)
  }

}

class DataMemory_test01(DUT: DataMemory) extends PeekPokeTester(DUT) {

  poke(DUT.io.Sim_StopLoading, 1.B)
  step(1)

  val WRITE_DATA = 1234

  poke(DUT.io.Address, 0.U)

  poke(DUT.io.WriteData, WRITE_DATA.S)
  poke(DUT.io.MemWriteSize, 1.U)

  poke(DUT.io.MemWrite, 1.B)
  poke(DUT.io.MemRead, 0.B)
  step(1)

  poke(DUT.io.MemRead, 1.B)
  poke(DUT.io.MemWrite, 0.B)

  expect(DUT.io.ReadData, WRITE_DATA.S, "io.ReadData == WRITE_DATA")
  expect(DUT.io.Sim_DataMemoryLoaded, 1.B, "io.Sim_DataMemoryLoaded == 1.B after 256 cycles")
}

class DataMemory_test02(DUT: DataMemory) extends PeekPokeTester(DUT) {

  poke(DUT.io.Sim_StopLoading, 1.B)
  step(1)


  val WRITE_DATA_1 = 1234
  val WRITE_DATA_2 = 5678

  poke(DUT.io.Address, 0.U)

  poke(DUT.io.WriteData, WRITE_DATA_1.S)
  poke(DUT.io.MemWriteSize, 1.U)

  poke(DUT.io.MemWrite, 1.B)
  poke(DUT.io.MemRead, 0.B)
  step(1)

  poke(DUT.io.WriteData, WRITE_DATA_2.S)
  poke(DUT.io.MemWriteSize, 1.U)

  poke(DUT.io.MemRead, 1.B)
  poke(DUT.io.MemWrite, 1.B)

  expect(DUT.io.ReadData, WRITE_DATA_1.S, "io.ReadData == WRITE_DATA_1")

  step(1)
  poke(DUT.io.MemWrite, 0.B)
  poke(DUT.io.MemRead, 1.B)

  expect(DUT.io.ReadData, WRITE_DATA_2.S, "io.ReadData == WRITE_DATA_2")
}

object DataMemory_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new DataMemory()) {
    DUT => new DataMemory_test01(DUT)
  }

  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new DataMemory()) {
    DUT => new DataMemory_test02(DUT)
  }

  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "on"), () => new DataMemory()) {
    DUT => new Sim_DataMemory_test01(DUT)
  }
}