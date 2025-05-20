package risc_v_tester

import chisel3.iotesters._
import chisel3._

import risc_v_patterson.components.ALU

// IO
// Source_1 = Input(SInt(32.W))
// Source_2 = Input(SInt(32.W))
//
// Operation = Input(UInt(4.W))
//
// Result = Output(SInt(32.W))
// Zero = Output(Bool())

// add testing
class ALU_test01(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = 10
  val source_2 = 20
  val expected_result = source_1 + source_2
  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("add"))
  expect(DUT.io.Result, expected_result.S, "io.Result === EXPECTED_RESULT when io.Operation = add")
  expect(DUT.io.Zero, (expected_result == 0).B, "io.Zero === expected_result == 0")
  expect(DUT.io.Positive, ((source_1 + source_2) > 0).B, "io.Positive === (source_1 + source_2) > 0")
}

// substract testing
class ALU_test02(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = 10
  val source_2 = 20
  val expected_result = source_1 - source_2
  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("subtract"))
  expect(DUT.io.Result, expected_result.S, "io.Result === EXPECTED_RESULT when io.Operation = subtract")
  expect(DUT.io.Zero, (expected_result == 0).B, "io.Zero === expected_result == 0")
  expect(DUT.io.Positive, ((source_1 - source_2) > 0).B, "io.Positive === (source_1 - source_2) > 0")
}

// AND testing
class ALU_test03(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = 1
  val source_2 = 3

  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("AND"))
  expect(DUT.io.Result, (source_1 & source_2).S, "io.Result === (source_1 & source_2) when io.Operation = AND")
  expect(DUT.io.Zero, ((source_1 & source_2) == 0).B, "io.Zero === (source_1 & source_2) == 0")
  expect(DUT.io.Positive, ((source_1 & source_2) > 0).B, "io.Positive === (source_1 & source_2) > 0")
}

// OR testing
class ALU_test04(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = 1
  val source_2 = 2

  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("OR"))
  expect(DUT.io.Result, (source_1 | source_2).S, "io.Result === (source_1 | source_2) when io.Operation = OR")
  expect(DUT.io.Zero, ((source_1 | source_2) == 0).B, "io.Zero === (source_1 | source_2) == 0")
  expect(DUT.io.Positive, ((source_1 | source_2) > 0).B, "io.Positive === (source_1 | source_2) > 0")
}

// XOR testing
class ALU_test05(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = 1
  val source_2 = 1

  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("XOR"))
  expect(DUT.io.Result, (source_1 ^ source_2).S, "io.Result === (source_1 ^ source_2) when io.Operation = XOR (bitwise XOR)")
  expect(DUT.io.Zero, ((source_1 ^ source_2) == 0).B, "io.Zero === (source_1 ^ source_2) == 0")
  expect(DUT.io.Positive, ((source_1 ^ source_2) > 0).B, "io.Positive === (source_1 ^ source_2) > 0")
}

// sll testing
class ALU_test06(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = -1
  val source_2 = 4

  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("sll"))
  expect(DUT.io.Result, (source_1 << source_2).S, "io.Result === (source_1 << source_2) when io.Operation = sll (shift left logical)")
  expect(DUT.io.Zero, ((source_1 << source_2) == 0).B, "io.Zero === (source_1 << source_2) == 0")
  expect(DUT.io.Positive, ((source_1 << source_2) > 0).B, "io.Positive === (source_1 << source_2) > 0")
}

// sra testing
class ALU_test07(DUT: ALU) extends PeekPokeTester(DUT) {
  val source_1 = -16
  val source_2 = 3

  poke(DUT.io.Source_1, source_1.S)
  poke(DUT.io.Source_2, source_2.S)
  poke(DUT.io.Operation, risc_v_patterson.commons.operations("sra"))
  expect(DUT.io.Result, (source_1 >> source_2).S, "io.Result === (source_1 >> source_2) when io.Operation = sra (shift right arithmetic)")
  expect(DUT.io.Zero, ((source_1 >> source_2) == 0).B, "io.Zero === (source_1 >> source_2) == 0")
  expect(DUT.io.Positive, ((source_1 >> source_2) > 0).B, "io.Positive === (source_1 >> source_2) > 0")
}

// tester exec
object ALU_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new ALU()) {
    DUT => {
      new ALU_test01(DUT)
      new ALU_test02(DUT)
      new ALU_test03(DUT)
      new ALU_test04(DUT)
      new ALU_test05(DUT)
      new ALU_test06(DUT)
      new ALU_test07(DUT)
    }
  }
}