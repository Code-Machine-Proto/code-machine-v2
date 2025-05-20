package risc_simple.shared

import chisel3._
import chisel3.util._
import chisel3.experimental.ChiselEnum

object State extends ChiselEnum{
val start :: fetch :: decode :: execute :: end :: Nil = Enum(5)
}

object Op_inst {
  val alu :: rm :: wm :: ldi :: branch :: stope :: Nil = Enum(6)
}

object Op_alu {
 val add :: sub :: shr :: shl :: not :: and :: or :: ld :: Nil = Enum(8)
}

object Constants {
val ADD  = 0x0
val SUB  = 0x1
val SHR  = 0x2
val SHL  = 0x3
val NOT  = 0x4
val AND  = 0x5
val OR   = 0x6
val LD   = 0x7
val RM   = 0x8
val WM   = 0x9
val LDI  = 0xa
val BRANCH = 0xc
val STOP = 0xf                 
}


