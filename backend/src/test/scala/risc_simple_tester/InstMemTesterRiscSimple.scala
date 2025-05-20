package risc_simple

import chisel3._
import chisel3.iotesters._

import risc_simple.program._

class InstMemTesterRiscSimple(DUT: InstMem) extends PeekPokeTester(DUT){ 
/*
def test (value : Seq[Int]) = {       
  for (i <- 0 until value.length ){     
    poke(DUT.io.addr, i)
    step(1)
    expect(DUT.io.inst, check_prog(i))
  }
}

def check_prog (add : Int) : Int = {
  add match {
    case 0x0 => 0xa010003   
    case 0x1 => 0xa020008    
    case 0x2 => 0x0050102  
    case 0x3 => 0x9000705    
    case 0x4 => 0x8090700    
    case 0x5 => 0xc000002    
    case 0x6 => 0xfeff456
    case _ => -77          // shall not happen
   }
  }
  
test(Assembler.prog)  
*/
}
/*
object InstMemTesterRiscSimple extends App{
chisel3.iotesters.Driver.execute(
Array("--generate-vcd-output","on"),
() => new InstMem("./programs_files/instructions.hex")) {
DUT => new InstMemTesterRiscSimple(DUT)}
}
*/
