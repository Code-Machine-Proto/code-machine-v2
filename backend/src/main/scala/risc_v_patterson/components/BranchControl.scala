package risc_v_patterson.components
import chisel3._
import chisel3.util.Enum
import risc_v_patterson.commons

class BranchControl extends Module {

  val branchTypes = commons.branchTypes

  val io = IO(new Bundle {
    val Zero = Input(Bool())
    val Positive = Input(Bool())

    val BranchType = Input(UInt(3.W))
    val Branch = Output(Bool())
  })

  val BranchWire = WireInit(0.B)

  // beq
  when(io.BranchType === branchTypes("beq").U){
    BranchWire := io.Zero
  }
    // bne
    .elsewhen(io.BranchType === branchTypes("bne").U){
    BranchWire := !io.Zero
  }
    // blt
    .elsewhen(io.BranchType === branchTypes("blt").U){
    BranchWire := !io.Positive
  }
    // bge
    .elsewhen(io.BranchType === branchTypes("bge").U){
    BranchWire := io.Positive || io.Zero
  }

  io.Branch := BranchWire
}
