package accumulator.accumulator_v1

import chisel3._
import chisel3.util._
import commons.instructions_v1

class accumulator_v1(internalMemoryContent:Array[UInt]) extends Module {
  val io = IO(new Bundle {
    val InputMemory = Input(Vec(256, UInt(16.W)))
    val PC = Output(UInt(16.W))
    val ACC = Output(SInt(16.W))
    val IR = Output(UInt(11.W))
    val State = Output(UInt(2.W))
    val InternalMemory = Output(Vec(256, UInt(16.W)))
    val StimulatedMemoryCell = Output(UInt(8.W))
    val Instruction = Output(UInt(4.W))
  })

  val fetch :: decode :: execute :: preload :: Nil = Enum(4)
  val add :: sub :: mul :: st :: ld :: stop :: nop :: br :: brz :: brnz :: Nil = Enum(10)

  val PC = RegInit(0.U(16.W))
  val ACC = RegInit(0.S(16.W))
  val IR = new instructions_v1
  val State = RegInit(fetch)

  val InternalMemory = RegInit(VecInit(Seq.fill(256)(0.U(16.W))))
  val InternalMemoryLoadingIdx = RegInit(0.U(8.W))

  val memoryLoaded = RegInit(0.B)
  val stopped = RegInit(0.B)

  val StimulatedMemoryCell = RegInit(0.U(8.W))

  when(memoryLoaded =/= 1.B){
    for(i <- 0 until internalMemoryContent.length){
      InternalMemory(i) := internalMemoryContent(i)
    }
    memoryLoaded := 1.B
//    InternalMemory(InternalMemoryLoadingIdx) := io.InputMemory(InternalMemoryLoadingIdx);
//    InternalMemoryLoadingIdx := InternalMemoryLoadingIdx + 1.U
//    when(InternalMemoryLoadingIdx === 255.U){
//      memoryLoaded := 1.B
//    }
  }

  when(memoryLoaded === 1.B){

    when(State === preload){
      State := fetch
      IR.addr := getAddress(InternalMemory(PC))
      IR.op := getOpcode(InternalMemory(PC))
    }

    when(State === fetch){
      State := decode
      IR.addr := getAddress(InternalMemory(PC))
      IR.op := getOpcode(InternalMemory(PC))

      StimulatedMemoryCell := 0.U
    }

    when(State === decode){
      State := execute

      // Could be refactored but the when condition would be too complicated for maintenance purpose...
      when(IR.op === add || IR.op === mul || IR.op === st || IR.op === ld){
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === br || IR.op === brz || IR.op === brnz){
        StimulatedMemoryCell := IR.addr
      }
      // stop and nop OP wont imply any memory access
      when(IR.op === stop || IR.op === nop){
        StimulatedMemoryCell := 0.U
      }

      when(IR.op === add){
        ACC := ACC + InternalMemory(IR.addr).asSInt()
      }
      when(IR.op === mul){
        ACC := ACC * InternalMemory(IR.addr).asSInt()
      }
      when(IR.op === sub){
        ACC := ACC - InternalMemory(IR.addr).asSInt()
      }

      when(IR.op === st){
        InternalMemory(IR.addr) := ACC.asUInt()
      }

      when(IR.op === ld){
        ACC := InternalMemory(IR.addr).asSInt()
      }
    }

    when(State === execute && IR.op =/= stop){
      State := fetch

      PC := PC + 1.U(1.W)
//      IR.addr := getAddress(InternalMemory(PC + 1.U(1.W)))
//      IR.op := getOpcode(InternalMemory(PC + 1.U(1.W)))

      // Could be refactored
      when(IR.op === br){
        PC := IR.addr
//        IR.addr := getAddress(InternalMemory(IR.addr))
//        IR.op := getOpcode(InternalMemory(IR.addr))
      }
      when(IR.op === brz && ACC === 0.S){
        PC := IR.addr
//        IR.addr := getAddress(InternalMemory(IR.addr))
//        IR.op := getOpcode(InternalMemory(IR.addr))
      }
      when(IR.op === brnz && ACC =/= 0.S){
        PC := IR.addr
//        IR.addr := getAddress(InternalMemory(IR.addr))
//        IR.op := getOpcode(InternalMemory(IR.addr))
      }

      StimulatedMemoryCell := 0.U
    }
  }

  for(idx <- 0 until InternalMemory.length){
    io.InternalMemory(idx) := InternalMemory(idx)
  }

  io.PC := PC
  io.ACC := ACC
  io.IR := Cat(IR.op, IR.addr)
  io.State := State
  io.StimulatedMemoryCell := StimulatedMemoryCell
  io.Instruction := IR.op

  def getOpcode(instruction: UInt): UInt = {
    instruction(15, 8)
  }

  def getAddress(instruction: UInt): UInt = {
    instruction(7, 0)
  }

}


