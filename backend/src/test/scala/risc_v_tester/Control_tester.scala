package risc_v_tester

import chisel3.iotesters._
import chisel3._

// MODULE INTERFACE:
// io = IO(new Bundle {
// InputSignal = Input(UInt(7.W))
//
// Branch = Output(Bool())
// MemRead = Output(Bool())
// MemWrite = Output(Bool())
// MemtoReg = Output(Bool())
// RegWrite = Output(Bool())
// ALUOp = Output(UInt(2.W))
// ALUSrc = Output(Bool())
//})

import risc_v_patterson.components.Control

class Control_test01(DUT: Control) extends PeekPokeTester(DUT) {
  poke(DUT.io.InputSignal, risc_v_patterson.commons.opcodes("Register"))
  expect(DUT.io.ALUSrc, 0.B, "io.ALUSrc === 0.B when Input is Register")
  expect(DUT.io.MemtoReg, 0.B, "io.MemtoReg === 0.B when Input is Register")
  expect(DUT.io.RegWrite, 1.B, "io.RegWrite === 1.B when Input is Register")
  expect(DUT.io.MemRead, 0.B, "io.MemRead === 0.B when Input is Register")
  expect(DUT.io.MemWrite, 0.B, "io.MemWrite === 0.B when Input is Register")
  expect(DUT.io.Branch, 0.B, "io.Branch === 0.B when Input is Register")
  expect(DUT.io.ALUOp, 2.U, "io.ALUOp === 2.U when Input is Register")
}

class Control_test02(DUT: Control) extends PeekPokeTester(DUT) {
  poke(DUT.io.InputSignal, risc_v_patterson.commons.opcodes("Load"))
  expect(DUT.io.ALUSrc, 1.B, "io.ALUSrc === 1.B when Input is Load")
  expect(DUT.io.MemtoReg, 1.B, "io.MemtoReg === 1.B when Input is Load")
  expect(DUT.io.RegWrite, 1.B, "io.RegWrite === 1.B when Input is Load")
  expect(DUT.io.MemRead, 1.B, "io.MemRead === 1.B when Input is Load")
  expect(DUT.io.MemWrite, 0.B, "io.MemWrite === 0.B when Input is Load")
  expect(DUT.io.Branch, 0.B, "io.Branch === 0.B when Input is Load")
  expect(DUT.io.ALUOp, 0.U, "io.ALUOp === 0.U when Input is Load")
}

class Control_test03(DUT: Control) extends PeekPokeTester(DUT) {
  poke(DUT.io.InputSignal, risc_v_patterson.commons.opcodes("Store"))
  expect(DUT.io.ALUSrc, 1.B, "io.ALUSrc === 1.B when Input is Store")
  expect(DUT.io.RegWrite, 0.B, "io.RegWrite === 0.B when Input is Store")
  expect(DUT.io.MemRead, 0.B, "io.MemRead === 0.B when Input is Store")
  expect(DUT.io.MemWrite, 1.B, "io.MemWrite === 1.B when Input is Store")
  expect(DUT.io.Branch, 0.B, "io.Branch === 0.B when Input is Store")
  expect(DUT.io.ALUOp, 0.U, "io.ALUOp === 0.U when Input is Store")
}

class Control_test04(DUT: Control) extends PeekPokeTester(DUT) {
  poke(DUT.io.InputSignal, risc_v_patterson.commons.opcodes("Branch"))
  expect(DUT.io.ALUSrc, 0.B, "io.ALUSrc === 0.B when Input is Branch")
  expect(DUT.io.RegWrite, 0.B, "io.RegWrite === 0.B when Input is Branch")
  expect(DUT.io.MemRead, 0.B, "io.MemRead === 0.B when Input is Branch")
  expect(DUT.io.MemWrite, 0.B, "io.MemWrite === 0.B when Input is Branch")
  expect(DUT.io.Branch, 1.B, "io.Branch === 1.B when Input is Branch")
  expect(DUT.io.ALUOp, 1.U, "io.ALUOp === 1.U when Input is Branch")
}

object Control_tester_exec extends App {
  chisel3.iotesters.Driver.execute(Array("--generate-vcd-output", "off"), () => new Control()) {
    DUT => {
      new Control_test01(DUT)
      new Control_test02(DUT)
      new Control_test03(DUT)
      new Control_test04(DUT)
    }
  }
}