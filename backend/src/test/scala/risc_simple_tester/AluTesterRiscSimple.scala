package risc_simple

import chisel3._
import chisel3.iotesters._

import risc_simple.shared.Constants._
import risc_simple.shared.Op_alu._

class AluTesterRiscSimple(DUT: Alu) extends PeekPokeTester(DUT){ 

def test (values : Seq[Int]) = {
  for (op <- add to ld){       
    for (a <- values ){     
      for(b <- values ){
        
        poke(DUT.io.ena, true.B)
        poke(DUT.io.op, op)
        poke(DUT.io.a, a)
        poke(DUT.io.b, b) 
  
        step(1)
  
        expect(DUT.io.f, check(a, b, op.toInt))
      }
    }
  }
}  

def check (a: Int, b:Int, op:Int) : Int = {
  op match {
    case 0 => a + b
    case 1 => a - b
    case 2 => a >> 1
    case 3 => a << 1
    case 4 => ~ a
    case 5 => a & b
    case 6 => a | b
    case 7 => a
    case _ => -99    // shall not happen
}
}

val interes = Array(0,1,10,1000) // an Overflow will cause errors as check() is 32.W
test(interes)

// Testing random values
//val randVal = Seq.fill(100)(scala.util.Random.nextInt)   
//test(randVal)
}

object AluTesterRiscSimple extends App{
chisel3.iotesters.Driver.execute(
Array("--generate-vcd-output","on"),
() => new Alu()) {
DUT => new AluTesterRiscSimple(DUT)}
}


