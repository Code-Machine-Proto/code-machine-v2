package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.Registers

class Registers_test01(DUT: Registers) extends PeekPokeTester(DUT) {

  val WRITE_DATA_1 = 1234
  val WRITE_DATA_2 = 5678

  poke(DUT.io.WriteRegister, 0.U)
  poke(DUT.io.WriteData, WRITE_DATA_1.S)
  poke(DUT.io.RegWrite, 1.B)
  step(1)
  poke(DUT.io.WriteRegister, 1.U)
  poke(DUT.io.WriteData, WRITE_DATA_2.S)
  poke(DUT.io.RegWrite, 1.B)
  step(1)

  poke(DUT.io.ReadRegister_1, 0.U)
  poke(DUT.io.ReadRegister_2, 1.U)
  poke(DUT.io.RegWrite, 0.B)
  step(1)

  expect(DUT.io.ReadData_1, WRITE_DATA_1.S, "io.ReadData_1 == WRITE_DATA_1")
  expect(DUT.io.ReadData_2, WRITE_DATA_2.S, "io.ReadData_2 == WRITE_DATA_2")
}

object Registers_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new Registers()) {
    DUT => new Registers_test01(DUT)
  }
}