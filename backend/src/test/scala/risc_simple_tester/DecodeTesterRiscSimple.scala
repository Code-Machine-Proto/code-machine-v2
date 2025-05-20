package risc_simple

import chisel3._
import chisel3.iotesters._

import risc_simple.shared.Op_inst._
import risc_simple.shared.Constants._

class DecodeTesterRiscSimple(DUT: Decode) extends PeekPokeTester(DUT){ 

def test (values : Seq[Int]) = {       
  for (instr_in <- values ){     
    poke(DUT.io.instr_in, instr_in)
    step(1)
    expect(DUT.io.decode_out.op_type, check_op(instr_in))
  }
}

def check_op (instr: Int) : Int = {
  val a = instr.asUInt()
  a(27,24).toInt match {
    case 0x0 => 0    // alu (add)
    case 0x1 => 0    // alu (sub)
    case 0x2 => 0    // alu (shr)
    case 0x3 => 0    // alu (shl)
    case 0x4 => 0    // alu (not)
    case 0x5 => 0    // alu (and)
    case 0x6 => 0    // alu (or)
    case 0x7 => 0    // alu (ld)
    case 0x8 => 1    // rm
    case 0x9 => 2    // wm
    case 0xa => 3   // ldi
    case 0xc => 4   // branch
    case 0xf => 5   // stopp
    case _ => 5    // shall not happen , stope
  }
}

val interes = Array(0xa010003,0xa020008,0x0050102,0x9000705,0x8090700,0xc000002,0xeeff456) 
test(interes)
}

object DecodeTesterRiscSimple extends App{
chisel3.iotesters.Driver.execute(
Array("--generate-vcd-output","on"),
() => new Decode()) {
DUT => new DecodeTesterRiscSimple(DUT)}
}


