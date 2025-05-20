package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.RegistersWriteDataSlicer

// Testing for byte
class RegistersWriteDataSlicer_test01(DUT: RegistersWriteDataSlicer) extends PeekPokeTester(DUT){
  val LoadType = risc_v_patterson.commons.loadTypes("byte").U
  val DummyData = risc_v_patterson.commons.MAX_VALUE_S32.S
  poke(DUT.io.LoadType, LoadType)
  poke(DUT.io.InputData, DummyData)
  expect(DUT.io.OutputData, DummyData(7, 0), "io.OutputData to be equal to io.InputData(7, 0) when LoadType is byte")
}

// Testing for half-word
class RegistersWriteDataSlicer_test02(DUT: RegistersWriteDataSlicer) extends PeekPokeTester(DUT){
  val LoadType = risc_v_patterson.commons.loadTypes("halfword").U
  val DummyData = risc_v_patterson.commons.MAX_VALUE_S32.S
  poke(DUT.io.LoadType, LoadType)
  poke(DUT.io.InputData, DummyData)
  expect(DUT.io.OutputData, DummyData(15, 0), "io.OutputData to be equal to io.InputData(15, 0) when LoadType is half-word")
}

// Testing for word
class RegistersWriteDataSlicer_test03(DUT: RegistersWriteDataSlicer) extends PeekPokeTester(DUT){
  val LoadType = risc_v_patterson.commons.loadTypes("word").U
  val DummyData = risc_v_patterson.commons.MAX_VALUE_S32.S
  poke(DUT.io.LoadType, LoadType)
  poke(DUT.io.InputData, DummyData)
  expect(DUT.io.OutputData, DummyData, "io.OutputData to be equal to io.InputData when LoadType is word")
}

object RegistersWriteDataSlicer_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new RegistersWriteDataSlicer()) {
    DUT => new RegistersWriteDataSlicer_test01(DUT)
  }
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new RegistersWriteDataSlicer()) {
    DUT => new RegistersWriteDataSlicer_test02(DUT)
  }
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new RegistersWriteDataSlicer()) {
    DUT => new RegistersWriteDataSlicer_test03(DUT)
  }
}