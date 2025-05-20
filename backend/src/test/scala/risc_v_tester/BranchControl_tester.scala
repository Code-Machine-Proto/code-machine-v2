package risc_v_tester

import chisel3.iotesters._
import chisel3._
import risc_v_patterson.components.BranchControl

// beq
class BranchControl_test01(DUT: BranchControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.Zero, 1.B)
  poke(DUT.io.BranchType, 0.U(3.W))
  expect(DUT.io.Branch, 1.B, "io.Branch === 1.B when branch type is beq, when io.Zero is 1.B")

  poke(DUT.io.Zero, 0.B)
  poke(DUT.io.BranchType, 0.U(3.W))
  expect(DUT.io.Branch, 0.B, "io.Branch !== 1.B when branch type is beq, when io.Zero is 0.B")
}
// bne
class BranchControl_test02(DUT: BranchControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.Zero, 0.B)
  poke(DUT.io.BranchType, 1.U(3.W))
  expect(DUT.io.Branch, 1.B, "io.Branch === 1.B when branch type is bne, when io.Zero is 0.B")

  poke(DUT.io.Zero, 1.B)
  poke(DUT.io.BranchType, 1.U(3.W))
  expect(DUT.io.Branch, 0.B, "io.Branch === 0.B when branch type is bne, when io.Zero is 1.B")
}
// blt
class BranchControl_test03(DUT: BranchControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.Positive, 0.B)
  poke(DUT.io.BranchType, 4.U(3.W))
  expect(DUT.io.Branch, 1.B, "io.Branch === 1.B when branch type is blt, when io.Positive is 0.B")

  poke(DUT.io.Positive, 1.B)
  poke(DUT.io.BranchType, 4.U(3.W))
  expect(DUT.io.Branch, 0.B, "io.Branch === 0.B when branch type is blt, when io.Positive is 1.B")
}
// bge
class BranchControl_test04(DUT: BranchControl) extends PeekPokeTester(DUT) {
  poke(DUT.io.Positive, 1.B)
  poke(DUT.io.BranchType, 5.U(3.W))
  expect(DUT.io.Branch, 1.B, "io.Branch === 1.B when branch type is bge, when io.Positive is 1.B")

  poke(DUT.io.Positive, 0.B)
  poke(DUT.io.Zero, 1.B)
  poke(DUT.io.BranchType, 5.U(3.W))
  expect(DUT.io.Branch, 1.B, "io.Branch === 1.B when branch type is bge, when io.Zero is 1.B")

  poke(DUT.io.Positive, 0.B)
  poke(DUT.io.Zero, 0.B)
  poke(DUT.io.BranchType, 5.U(3.W))
  expect(DUT.io.Branch, 0.B, "io.Branch === 0.B when branch type is bge, when io.Zero and io.Positive are 0.B")
}

object BranchControl_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new BranchControl()) {
    DUT => {
      new BranchControl_test01(DUT)
      new BranchControl_test02(DUT)
      new BranchControl_test03(DUT)
      new BranchControl_test04(DUT)
    }
  }
}