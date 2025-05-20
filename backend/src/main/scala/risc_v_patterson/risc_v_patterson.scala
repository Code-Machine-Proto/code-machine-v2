package risc_v_patterson

import chisel3._
import chisel3.util._
import risc_v_patterson.components.{ALU, ALUControl, BranchControl, Control, DataMemory, ImmGen, InstructionMemory, Registers, RegistersWriteDataSlicer}

class risc_v_patterson() extends Module {
  val io = IO(new Bundle {
    val Sim_InstructionIn = Input(UInt(32.W))
    val Sim_DataIn = Input(SInt(32.W))
    val Sim_DataSize = Input(UInt(3.W))
    val Sim_StopLoading = Input(Bool())

    val Sim_WriteRegister = Input(UInt(5.W))
    val Sim_WriteData = Input(SInt(32.W))
    val Sim_RegWrite = Input(Bool())
    val Sim_RegistersVec = Input(Vec(32, SInt(32.W)))

    val db_InstructionMemory = Output(Vec(risc_v_patterson.commons.instructionMemorySize, UInt(32.W)))
    val db_Registers = Output(Vec(32, SInt(32.W)))
    val db_DataMemory = Output(Vec(risc_v_patterson.commons.dataMemorySize, SInt(32.W)))

    val db_ALU_Result = Output(SInt(32.W))
    val db_PC = Output(UInt(8.W))
    val db_STATE = Output(UInt(3.W))
    val Sim_InstructionMemoryLoaded = Output(Bool())
    val Sim_DataMemoryLoaded = Output(Bool())
  })

  val instructionMemory = Module(new InstructionMemory())
  val registers = Module(new Registers())
  val registersWriteDataSlicer = Module(new RegistersWriteDataSlicer())
  val ALU = Module(new ALU())
  val ALUControl = Module(new ALUControl())
  val BranchControl = Module(new BranchControl())
  val dataMemory = Module(new DataMemory())
  val immGen = Module(new ImmGen())
  val control = Module(new Control())

  val PC = RegInit(0.U(8.W))
  val PCWire = WireInit(0.U(8.W))

  val STATE = RegInit(risc_v_patterson.commons.states("InstructionFetch").U(3.W))
  val STATEWire = WireInit(risc_v_patterson.commons.states("InstructionFetch").U(3.W))

  // Wiring
  // InstructionMemory wiring
  instructionMemory.io.Sim_InstructionIn := io.Sim_InstructionIn
  instructionMemory.io.ReadAddress := PC >> 2

  // RegistersWriteDataSlicer wiring
  registersWriteDataSlicer.io.InputData := dataMemory.io.ReadData
  registersWriteDataSlicer.io.LoadType := instructionMemory.io.InstructionOut(14, 12)

  // Registers wiring
  registers.io.Sim_WriteRegister := io.Sim_WriteRegister
  registers.io.Sim_RegWrite := io.Sim_RegWrite
  registers.io.Sim_WriteData := io.Sim_WriteData
  registers.io.Sim_RegistersVec := io.Sim_RegistersVec

  registers.io.ReadRegister_1 := instructionMemory.io.InstructionOut(19, 15)
  registers.io.ReadRegister_2 := instructionMemory.io.InstructionOut(24, 20)
  registers.io.WriteRegister := instructionMemory.io.InstructionOut(11, 7)
  registers.io.WriteData := Mux(control.io.MemtoReg, registersWriteDataSlicer.io.OutputData, ALU.io.Result)
  registers.io.RegWrite := control.io.RegWrite

  // ImmGen Wiring
  immGen.io.InstructionIn := instructionMemory.io.InstructionOut

  // ALU Control wiring
  ALUControl.io.InstructionIn := Cat(instructionMemory.io.InstructionOut(31, 25), instructionMemory.io.InstructionOut(14, 12))
  ALUControl.io.ALUOp := control.io.ALUOp

  // ALU wiring
  ALU.io.Source_1 := registers.io.ReadData_1
  ALU.io.Source_2 := Mux(control.io.ALUSrc, immGen.io.ImmOut, registers.io.ReadData_2)
  ALU.io.Operation := ALUControl.io.Operation

  // BranchControl Wiring
  BranchControl.io.Zero := ALU.io.Zero
  BranchControl.io.Positive := ALU.io.Positive
  BranchControl.io.BranchType := instructionMemory.io.InstructionOut(14, 12)

  // DataMemory wiring
  dataMemory.io.Address := ALU.io.Result.asUInt()
  dataMemory.io.WriteData := registers.io.ReadData_2

  dataMemory.io.MemWrite := control.io.MemWrite

  dataMemory.io.MemWriteSize := instructionMemory.io.InstructionOut(14, 12)
  dataMemory.io.MemRead := control.io.MemRead

  dataMemory.io.Sim_StopLoading := io.Sim_StopLoading
  dataMemory.io.Sim_DataIn := io.Sim_DataIn
  dataMemory.io.Sim_DataSize := io.Sim_DataSize

  // PC / STATE wiring
  // states = Map("InstructionFetch" -> 0, "ReadReg" -> 1, "ExecuteOp" -> 2, "DataAccess" -> 3, "WriteReg" -> 4)
  STATE := STATEWire
  PC := PCWire

  // Control wiring
  control.io.InputSignal := instructionMemory.io.InstructionOut(6, 0)

  when(instructionMemory.io.Sim_InstructionMemoryLoaded && dataMemory.io.Sim_DataMemoryLoaded){
    PC := Mux(control.io.Branch && BranchControl.io.Branch, PC + immGen.io.ImmOut.asUInt(), PC + 4.U)
  }

  io.db_PC := PCWire
  io.db_STATE := STATEWire
  io.db_ALU_Result := ALU.io.Result

  io.db_DataMemory := dataMemory.io.db_InternalMemory
  io.db_Registers := registers.io.db_RegistersVec
  io.db_InstructionMemory := instructionMemory.io.db_InternalMemory

  io.Sim_DataMemoryLoaded := dataMemory.io.Sim_DataMemoryLoaded
  io.Sim_InstructionMemoryLoaded := instructionMemory.io.Sim_InstructionMemoryLoaded

}
