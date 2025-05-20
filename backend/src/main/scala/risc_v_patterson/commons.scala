package risc_v_patterson

object commons {

  val MAX_VALUE_S32 = 2147483647
  val MAX_VALUE_S16 = 32767
  val MAX_VALUE_S8 = 127

  val opcodes = Map("Register" -> 51, "Load" -> 3, "Store" -> 35, "Branch" -> 99, "Immediate" -> 19)

  val registerOpcodes = Map("add" -> 0, "sub" -> 256, "sll" -> 1, "XOR" -> 4, "sra" -> 261, "OR" -> 6, "AND" -> 7)

  val immediateOpcodes = Map("addi" -> 0, "andi" -> 7, "ori" -> 6, "xori" -> 4, "slli" -> 1, "srai" -> 5)

  val operations = Map("add" -> 2, "subtract" -> 6, "AND" -> 0, "OR" -> 1, "XOR" -> 3, "sll" -> 4, "sra" -> 5)

  val instructionMemorySize = 256
  val dataMemorySize = 256
  val states = Map("InstructionFetch" -> 0, "ReadReg" -> 1, "ExecuteOp" -> 2, "DataAccess" -> 3, "WriteReg" -> 4)

  val branchTypes = Map("beq" -> 0, "bne" -> 1, "blt" -> 4, "bge" -> 5)

  val dataTypes = Map("char" -> 1, "byte" -> 1, "short" -> 2, "int" -> 4, "long" -> 4)

  val loadTypes = Map("byte" -> 0, "halfword" -> 1, "word" -> 2)
}
