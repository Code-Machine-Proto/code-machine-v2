package risc_v_patterson.components

import chisel3._
import risc_v_patterson.commons

class Control extends Module{
  val io = IO(new Bundle {
    val InputSignal = Input(UInt(7.W))

    val Branch = Output(Bool())
    val MemRead = Output(Bool())
    val MemWrite = Output(Bool())
    val MemtoReg = Output(Bool())
    val RegWrite = Output(Bool())
    val ALUOp = Output(UInt(2.W))
    val ALUSrc = Output(Bool())
  })

  val BranchWire = WireInit(0.B)
  val MemReadWire = WireInit(0.B)
  val MemWriteWire = WireInit(0.B)
  val MemtoRegWire = WireInit(0.B)
  val RegWriteWire = WireInit(0.B)
  val ALUOpWire = WireInit(0.U(2.W))
  val ALUSrcWire = WireInit(0.B)

  when(io.InputSignal === commons.opcodes("Register").U){
    ALUSrcWire := 0.B
    MemtoRegWire := 0.B
    RegWriteWire := 1.B
    MemReadWire := 0.B
    MemWriteWire := 0.B
    BranchWire := 0.B
    ALUOpWire := 2.U
  }.elsewhen(io.InputSignal === commons.opcodes("Load").U){
    ALUSrcWire := 1.B
    MemtoRegWire := 1.B
    RegWriteWire := 1.B
    MemReadWire := 1.B
    MemWriteWire := 0.B
    BranchWire := 0.B
    ALUOpWire := 0.U
  }.elsewhen(io.InputSignal === commons.opcodes("Store").U){
    ALUSrcWire := 1.B
    MemtoRegWire := DontCare
    RegWriteWire := 0.B
    MemReadWire := 0.B
    MemWriteWire := 1.B
    BranchWire := 0.B
    ALUOpWire := 0.U
  }.elsewhen(io.InputSignal === commons.opcodes("Branch").U){
    ALUSrcWire := 0.B
    MemtoRegWire := DontCare
    RegWriteWire := 0.B
    MemReadWire := 0.B
    MemWriteWire := 0.B
    BranchWire := 1.B
    ALUOpWire := 1.U
  }.elsewhen(io.InputSignal === commons.opcodes("Immediate").U){
    ALUSrcWire := 1.B
    MemtoRegWire := 0.B
    RegWriteWire := 1.B
    MemReadWire := 0.B
    MemWriteWire := 0.B
    BranchWire := 0.B
    // When ALUOpWire = 3.U, its an Immediate type of instruction
    ALUOpWire := 3.U
  }.otherwise {
    ALUSrcWire := 0.B
    MemtoRegWire := 0.B
    RegWriteWire := 0.B
    MemReadWire := 0.B
    MemWriteWire := 0.B
    BranchWire := 0.B
    ALUOpWire := 0.U
  }
  io.Branch := BranchWire
  io.MemRead := MemReadWire
  io.MemWrite := MemWriteWire
  io.MemtoReg := MemtoRegWire
  io.RegWrite := RegWriteWire
  io.ALUOp := ALUOpWire
  io.ALUSrc := ALUSrcWire
}
