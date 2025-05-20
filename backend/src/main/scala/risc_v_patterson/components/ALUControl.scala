package risc_v_patterson.components

import chisel3._
import risc_v_patterson.commons

class ALUControl extends Module{

  val immediateOpcodes = commons.immediateOpcodes
  val registerOpcodes = commons.registerOpcodes
  val operations = commons.operations

  val io = IO(new Bundle{
    val ALUOp = Input(UInt(2.W))
    val InstructionIn = Input(UInt(10.W))

    val Operation = Output(UInt(4.W))
  })

  val OperationWire = WireInit(0.U(4.W))

  // ld and sd
  when(io.ALUOp === 0.U){
    OperationWire := operations("add").U
  }
    // branch (sub)
  .elsewhen(io.ALUOp === 1.U){
    OperationWire := operations("subtract").U
  }
    // register type
  .elsewhen(io.ALUOp === 2.U){
    // add R-type
    when(io.InstructionIn === registerOpcodes("add").U){
      OperationWire := operations("add").U;
    } // sub R-type
    .elsewhen(io.InstructionIn === registerOpcodes("sub").U){
      OperationWire := operations("subtract").U;
    } // AND R-type
    .elsewhen(io.InstructionIn === registerOpcodes("AND").U){
      OperationWire := operations("AND").U
    } // OR R-type
    .elsewhen(io.InstructionIn === registerOpcodes("OR").U){
      OperationWire := operations("OR").U
    } // XOR R-type
    .elsewhen(io.InstructionIn === registerOpcodes("XOR").U){
      OperationWire := operations("XOR").U
    } // sll R-type
    .elsewhen(io.InstructionIn === registerOpcodes("sll").U){
      OperationWire := operations("sll").U
    } // sra R-type
    .elsewhen(io.InstructionIn === registerOpcodes("sra").U){
      OperationWire := operations("sra").U
    }
  }
    // Immediate type
    .elsewhen(io.ALUOp === 3.U){
      when(io.InstructionIn(2, 0) === immediateOpcodes("addi").U){
        OperationWire := operations("add").U
      }.elsewhen(io.InstructionIn(2, 0) === immediateOpcodes("andi").U){
        OperationWire := operations("AND").U
      }.elsewhen(io.InstructionIn(2, 0) === immediateOpcodes("ori").U){
        OperationWire := operations("OR").U
      }.elsewhen(io.InstructionIn(2, 0) === immediateOpcodes("xori").U){
        OperationWire := operations("XOR").U
      }.elsewhen(io.InstructionIn(2, 0) === immediateOpcodes("slli").U){
        OperationWire := operations("sll").U
      }.elsewhen(io.InstructionIn(2, 0) === immediateOpcodes("srai").U){
        OperationWire := operations("sra").U
      }
  }

  io.Operation := OperationWire;
}
