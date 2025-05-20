package commons

import chisel3._
import chisel3.util.Enum

// No need to separate classes but it was done to differentiate enum values

class instructions_v1() extends Bundle {

  val add :: sub :: mul :: st :: ld :: stop :: nop :: br :: brz :: brnz :: Nil = Enum(10)
  val addr = RegInit(0.U(8.W));
  val op = RegInit(nop);
}

class instructions_v2() extends Bundle {
  val add :: sub :: mul :: adda :: suba :: addx :: subx :: ld :: st :: lda :: sta :: ldi :: sti :: br :: brz :: brnz :: shl :: shr :: and :: stop :: nop :: Nil = Enum(21)
  val addr = RegInit(0.U(8.W));
  val op = RegInit(nop);
}