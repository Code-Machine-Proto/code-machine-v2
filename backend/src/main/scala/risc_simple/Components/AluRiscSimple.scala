package risc_simple

import chisel3._
import chisel3.util._

import risc_simple.shared.Op_alu._


class Alu() extends Module {
  val io = IO(new Bundle {
    val op = Input(UInt(3.W))         
    val a  = Input(SInt(16.W))   //    
    val b  = Input(SInt(16.W))    //
    val ena = Input(Bool())        

    val f  = Output(SInt(16.W))    //
    val Z  = Output(Bool())
    val N  = Output(Bool())
  })
 
  val F = RegInit(0.S(16.W)) 
   
 // input variables
  val op = io.op
  val a  = io.a
  val b  = io.b
  val ena = io.ena
  
  // logic 
  when(ena) {
    switch(op) {
      is(add) {F := a + b}
      is(sub) {F := a - b}
      is(shr) {F := a >> 1}
      is(shl) {F := a << 1}
      is(not) {F := ~a}
      is(and) {F := a & b}
      is(or)  {F := a | b}
      is(ld)  {F := a}
    }
  }
  io.f := F
  io.Z := (F === 0.S)
  io.N := (F < 0.S)
}
