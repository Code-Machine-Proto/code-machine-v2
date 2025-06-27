package accumulator.accumulator_v2

import chisel3._
import chisel3.util._
import commons.instructions_v2

class accumulator_v2() extends Module {
  val io = IO(new Bundle {
    val InputMemory = Input(Vec(256, UInt(16.W)))
    val PC = Output(UInt(16.W))
    val ACC = Output(SInt(16.W))
    val IR = Output(UInt(16.W))
    val State = Output(UInt(2.W))
    val MA = Output(UInt(16.W))
    val InternalMemory = Output(Vec(256, UInt(16.W)))
    val StimulatedMemoryCell = Output(UInt(8.W))
    val Instruction = Output(UInt(5.W))
  })

  val fetch :: decode :: execute :: Nil = Enum(3)
  val add :: sub :: mul :: adda :: suba :: addx :: subx :: ld :: st :: lda :: sta :: ldi :: sti :: br :: brz :: brnz :: shl :: shr :: and :: stop :: nop :: Nil = Enum(21)

  val PC = RegInit(0.U(16.W))
  val ACC = RegInit(0.S(16.W))
  val IR = new instructions_v2
  val State = RegInit(fetch)
  val MA = RegInit(0.U(16.W))

  val InternalMemory = RegInit(VecInit(Seq.fill(256)(0.U(16.W))))
  val InternalMemoryLoadingIdx = RegInit(0.U(8.W))

  val memoryLoaded = RegInit(0.B)
  val stopped = RegInit(0.B)
  val StimulatedMemoryCell = RegInit(0.U(8.W))

  when(memoryLoaded =/= 1.B){
    InternalMemory(InternalMemoryLoadingIdx) := io.InputMemory(InternalMemoryLoadingIdx);
    InternalMemoryLoadingIdx := InternalMemoryLoadingIdx + 1.U
    when(InternalMemoryLoadingIdx === 255.U){
      memoryLoaded := 1.B
    }
  }

  when(memoryLoaded === 1.B){
    when(State === fetch){
      State := decode
      IR.addr := getAddress(InternalMemory(PC).asUInt())
      IR.op := getOpcode(InternalMemory(PC).asUInt())
      StimulatedMemoryCell := 0.U
    }

    when(State === decode){
      State := execute
      }

    when(State === execute){
      State := fetch
      PC := PC + 1.U(1.W)

      when(IR.op === add){
        ACC := ACC + InternalMemory(IR.addr).asSInt()
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === sub){
        ACC := ACC - InternalMemory(IR.addr).asSInt()
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === mul){
        ACC := ACC * InternalMemory(IR.addr).asSInt()
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === adda){
        MA := MA + InternalMemory(IR.addr)
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === suba){
        MA := MA - InternalMemory(IR.addr)
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === addx){
        ACC := ACC + InternalMemory(MA).asSInt()
        StimulatedMemoryCell := MA
      }
      when(IR.op === subx){
        ACC := ACC - InternalMemory(MA).asSInt()
        StimulatedMemoryCell := MA
      }
      when(IR.op === st){
        InternalMemory(IR.addr) := ACC.asUInt()
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === ld){
        ACC := InternalMemory(IR.addr).asSInt()
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === sta){
        InternalMemory(IR.addr) := MA
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === lda){
        MA := InternalMemory(IR.addr)
        StimulatedMemoryCell := IR.addr
      }
      when(IR.op === sti){
        InternalMemory(MA) := ACC.asUInt()
        StimulatedMemoryCell := MA
      }
      when(IR.op === ldi){
        ACC := InternalMemory(MA).asSInt()
        StimulatedMemoryCell := MA
      }
      when(IR.op === shl){
        ACC := ACC << 1
      }
      when(IR.op === shr){
        ACC := ACC >> 1
      }
      when(IR.op === and){
        ACC := ACC & InternalMemory(IR.addr).asSInt()
      }
    // }
    // when(State === execute && IR.op =/= stop){
      // State := fetch

      when(IR.op === br){
        PC := IR.addr
      }
      when(IR.op === brz && ACC === 0.S){
        PC := IR.addr
      }
      when(IR.op === brnz && ACC =/= 0.S){
        PC := IR.addr
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
  io.MA := MA
  io.State := State
  io.Instruction := IR.op
  io.StimulatedMemoryCell := StimulatedMemoryCell

  def getOpcode(instruction: UInt): UInt = {
    instruction(15, 8)
  }

  def getAddress(instruction: UInt): UInt = {
    instruction(7, 0)
  }
}


