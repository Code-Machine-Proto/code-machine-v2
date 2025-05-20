package risc_simple

import chisel3._
import chisel3.iotesters._

import risc_simple.program._

class RegTesterRiscSimple(DUT: BlocReg) extends PeekPokeTester(DUT){ 

def test (value : Array[Int]) = {       
  for (i <- 0 until 2 ){     
    poke(DUT.io.rdst, i)
    poke(DUT.io.data_in, Assembler.prog(i).asUInt())
    poke(DUT.io.wreg, true.B)
    poke(DUT.io.rsrc2, i)
    //poke(DUT.io.rsrc1, i)
    step(1)
    expect(DUT.io.b, check_prog(i))
    //expect(DUT.io.a, check_prog(i))
  }
  for (i <- 3 until value.length ){     
    poke(DUT.io.rdst, i)
    poke(DUT.io.data_in, Assembler.prog(i).asUInt())
    poke(DUT.io.wreg, false.B)
    poke(DUT.io.rsrc2, 0)        // see if we save the value of address 0
    //poke(DUT.io.rsrc1, i)
    step(1)
    expect(DUT.io.b, check_prog(i))
    //expect(DUT.io.a, check_prog(i))
  }
}

def check_prog (add : Int) : Int = {
  add match {
    case 0x0 => 0x0003   
    case 0x1 => 0x0008    
    case 0x2 => 0x0102  
    case 0x3 => 0x0705    
    case 0x4 => 0x0700    
    case 0x5 => 0x0002    
    case 0x6 => 0xf456
    case _ => -77          // shall not happen
   }
  }
  
//test(Assembler.prog)  
}

object RegTesterRiscSimple extends App{
chisel3.iotesters.Driver.execute(
Array("--generate-vcd-output","on"),
() => new BlocReg()) {
DUT => new RegTesterRiscSimple(DUT)}
}
