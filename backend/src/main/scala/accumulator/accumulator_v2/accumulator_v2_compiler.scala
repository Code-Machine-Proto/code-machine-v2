package accumulator.accumulator_v2

import chisel3._
import chisel3.util._

import scala.collection.mutable
import scala.io.Source
import scala.reflect.ClassTag

object accumulator_v2_compiler {

  var labels = mutable.LinkedHashMap[String, Int]()
  var values = mutable.LinkedHashMap[String, Array[Int]]()
  val opcodeMap = Map("add" -> 0, "sub" -> 1, "mul" -> 2, "adda" -> 3, "suba" -> 4, "addx" -> 5, "subx" -> 6, "ld" -> 7, "st" -> 8,
    "lda" -> 9, "sta" -> 10, "ldi" -> 11, "sti" -> 12, "br" -> 13, "brz" -> 14, "brnz" -> 15, "stop" -> 16, "nop" -> 17)

  object lineStates {
    val lineError      = -1
    val fetchLines     = 0 
    val dec            = 1
    val add_sub_mul_ex = 2
    val adda_suba_ex   = 3
    val addx_subx_ex   = 4
    val sh_ex          = 5
    val st_ex          = 6
    val ld_ex          = 7
    val lda_ex         = 8
    val ldi_ex         = 9
    val sta_ex         = 10
    val sti_ex         = 11
    val branching_ex   = 12
    val nop            = 13
  }

  object instructionState {
    val fetch =  0
    val decode = 1
    val execute= 2 
    val preload= 3
  }

  object opcode {
    val add = 0
    val sub = 1
    val mul = 2
    val adda= 3
    val suba= 4
    val addx= 5
    val subx= 6
    val ld  = 7
    val st  = 8
    val lda = 9
    val sta = 10
    val ldi = 11
    val sti = 12
    val br  = 13
    val brz = 14
    val brnz= 15
    val shl = 16
    val shr = 17
    val and = 18
    val stop =19
    val nop = 20
  }

  val add :: sub :: mul :: adda :: suba :: addx :: subx :: ld :: st :: lda :: sta :: ldi :: sti :: br :: brz :: brnz :: stop :: nop :: Nil = Enum(18)

  def compile(programFilename: String): Array[UInt] = {

    var instructionsUInt = Array[UInt]()
    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = readFile(programFilename)
    instructionsString = removeEmptyLines(instructionsString)
    instructionsString = formatSpaces(instructionsString)

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      // label:
      //  instructions1
      //  instructions2
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        if(values.contains(key)){
          for(labelValue <- values(key)){
            // Convert a Signed value to an Unsigned
            if(labelValue < 0){
              instructionsUInt = instructionsUInt :+ intToBinary16(labelValue.toInt).U(16.W)
            }else{
              instructionsUInt = instructionsUInt :+ labelValue.U(16.W)
            }
            instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
          }
        }
      }else{
        if(instructionsString(index).split(" ").length > 1){
          val opcode = getOpcode(instruction)
          val arg = computeIndexes(instruction, labels)
          instructionsUInt = instructionsUInt :+ (BigInt(opcode) << 8 | BigInt(arg)).U(16.W)
          instructionsHex = instructionsHex :+ "0x" + (BigInt(opcode) << 8 | BigInt(arg)).toInt.toHexString.toUpperCase
        }else{
          // stop or nop
          if(instruction == "stop" || instruction == "nop"){
            instructionsUInt = instructionsUInt :+ (BigInt(opcodeMap(instruction)) << 8 | BigInt(0)).U(16.W)
            instructionsHex = instructionsHex :+ "0x" + (BigInt(opcodeMap(instruction)) << 8 | BigInt(0)).toInt.toHexString.toUpperCase
          }
          // Single value (either X or X,)
          else{
            instruction = instruction.trim().replaceAll(",", "")
            instructionsUInt = instructionsUInt :+ intToBinary16(instruction.toInt).U(16.W)
            instructionsHex = instructionsHex :+ "0x" + (instruction.toInt).toHexString.toUpperCase
          }

        }
      }

    }
    printArray(instructionsHex)
    instructionsUInt
  }

  def compileFromArray(program: Array[String]): Array[UInt] = {

    var instructionsUInt = Array[UInt]()
    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = removeDirectives(formatSpaces(removeEmptyLines(program)))

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      // label:
      //  instructions1
      //  instructions2
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        if(values.contains(key)){
          for(labelValue <- values(key)){
            // Convert a Signed value to an Unsigned
            if(labelValue < 0){
              instructionsUInt = instructionsUInt :+ intToBinary16(labelValue.toInt).U(16.W)
            }else{
              instructionsUInt = instructionsUInt :+ labelValue.U(16.W)
            }
            instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
          }
        }
      }else{
        if(instructionsString(index).split(" ").length > 1){
          val opcode = getOpcode(instruction)
          val arg = computeIndexes(instruction, labels)
          instructionsUInt = instructionsUInt :+ (BigInt(opcode) << 8 | BigInt(arg)).U(16.W)
          instructionsHex = instructionsHex :+ "0x" + (BigInt(opcode) << 8 | BigInt(arg)).toInt.toHexString.toUpperCase
        }else{
          // stop or nop
          if(instruction == "stop" || instruction == "nop"){
            instructionsUInt = instructionsUInt :+ (BigInt(opcodeMap(instruction)) << 8 | BigInt(0)).U(16.W)
            instructionsHex = instructionsHex :+ "0x" + (BigInt(opcodeMap(instruction)) << 8 | BigInt(0)).toInt.toHexString.toUpperCase
          }
          // Single value (either X or X,)
          else{
            instruction = instruction.trim().replaceAll(",", "")
            instructionsUInt = instructionsUInt :+ intToBinary16(instruction.toInt).U(16.W)
            instructionsHex = instructionsHex :+ "0x" + (instruction.toInt).toHexString.toUpperCase
          }

        }
      }

    }
    instructionsUInt
  }

  def getHexCodeFromArray(program: Array[String]): Array[String] = {
    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = removeDirectives(formatSpaces(removeEmptyLines(program)))

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      // label:
      //  instructions1
      //  instructions2
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        if(values.contains(key)){
          for(labelValue <- values(key)){
            // Convert a Signed value to an Unsigned
            instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
          }
        }
      }else{
        if(instructionsString(index).split(" ").length > 1){
          val opcode = getOpcode(instruction)
          val arg = computeIndexes(instruction, labels)
          instructionsHex = instructionsHex :+ "0x" + (BigInt(opcode) << 8 | BigInt(arg)).toInt.toHexString.toUpperCase
        }else{
          // stop or nop
          if(instruction == "stop" || instruction == "nop"){
            instructionsHex = instructionsHex :+ "0x" + (BigInt(opcodeMap(instruction)) << 8 | BigInt(0)).toInt.toHexString.toUpperCase
          }
          // Single value (either X or X,)
          else{
            instruction = instruction.trim().replaceAll(",", "")
            instructionsHex = instructionsHex :+ "0x" + (instruction.toInt).toHexString.toUpperCase
          }

        }
      }

    }
    instructionsHex
  }

  def readFile(programFilename: String): Array[String] = {
    var lines = Array[String]()
    for(line <- Source.fromFile(programFilename).getLines()){
      lines = lines :+ line
    }
    lines
  }

  def removeEmptyLines(lines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- lines){
      if(!line.matches("\\ +") && line.length != 0){
        toReturn = toReturn :+ line
      }
    }
    toReturn
  }

  def formatSpaces(lines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- lines){
      toReturn = toReturn :+ line.trim().replaceAll(" +", " ")
    }
    toReturn
  }

  def mapLabels(lines: Array[String]): mutable.LinkedHashMap[String, Int] = {
    val labels = mutable.LinkedHashMap[String, Int]()
    var nInstructionLabels = 0
    for(index <- 0 until lines.length){
      val line = lines(index)
      if(isEmptyLabel(index, lines)) nInstructionLabels = nInstructionLabels + 1
      if(line.matches(".+:.+") || line.matches(".+:.*")){
        val label = line.split(":")(0)
        var address = index + computeOffset(label, values)
        address = address - (nInstructionLabels)
        if(isEmptyLabel(index, lines)) address = address + 1
        labels.put(label, address)
      }

    }
    labels
  }

  def mapValues(lines: Array[String]): mutable.LinkedHashMap[String, Array[Int]] = {
    var values = mutable.LinkedHashMap[String, Array[Int]]()
    for(line <- lines){
      if(line.matches(".+:.+")){
        val label = line.split(":")(0)
        val stringArray = line.split(":")(1).split(",")
        var intArray = Array[Int]()
        for(element <- stringArray){
          intArray = intArray :+ element.trim().replaceAll(" +", "").toInt
        }
        values.put(label, intArray)
      } else if(line.matches(".+:.*")){
        val label = line.split(":")(0)
        values.put(label, Array[Int]())
      }
    }
    values
  }

  def mapLabelAddress(lines: Array[String]): mutable.LinkedHashMap[String, Int] = {
    values = mapValues(lines)
    mapLabels(lines)
  }

  def getOpcode(instruction: String): Int = {
    opcodeMap(instruction.split(" ")(0))
  }

  def computeIndexes(instruction: String, map: mutable.LinkedHashMap[String, Int]): Int = {

    val args = instruction.trim().replaceAll(" +", " ").split(" ")

    // opcode label + index
    if(args.length == 4){
      map(args(1)) + args(3).toInt
    }
    else{
      // opcode addr
      if(args(1).matches("\\d+")){
        args(1).toInt
      }
      // opcode label
      else{
        map(args(1))
      }
    }

  }

  def computeOffset(key: String, map: mutable.LinkedHashMap[String, Array[Int]]): Int = {
    var offset = 0
    if(map.contains(key)){
      var index = 0
      for((keyValue, arrayValue) <- map){
        if (keyValue != key){
          offset = offset + arrayValue.length
        }else{
          return offset - index
        }
        if(arrayValue.length > 0) index = index + 1
      }
    }
    offset
  }

  def printArray[T: ClassTag](array: Array[T]): Unit = {
    for(element <- array){
      println(element.toString)
    }
  }

  def printMap[keyType: ClassTag, valueType: ClassTag](map: mutable.LinkedHashMap[keyType, valueType]): Unit = {
    for((key, value) <- map){
      println(key.toString + " -> " + value.toString)
    }
  }

  def isEmptyLabel(index: Int, instructions: Array[String]): Boolean = {
    val instruction = instructions(index)
    if(index < instructions.length - 1 && !opcodeMap.contains(instruction.split(" ")(0))){
      instruction.split(":").length == 1
    }else{
      false
    }
  }

  def intToBinary16(value: Int): String = {
    var binaryString = value.toBinaryString
    if(value >= 0){
      while(binaryString.length < 16){
        binaryString = "0" + binaryString
      }
    }
    ("b" + binaryString.slice(binaryString.length - 17, binaryString.length - 1))
  }

  def removeDirectives(lines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    val directives = Array[String](".text", ".data");

    for(line <- lines) {
      var isDirective = false;
      for (directive <- directives) {
        if (line.toLowerCase.contains(directive))
          isDirective = true;
      }
      if (!isDirective)
        toReturn = toReturn :+ line;
    }
    toReturn
  }

  def getStimulatedLines(instruction: Int, state: Int, accValue: BigInt): Int = {
    var lineState = lineStates.lineError
    if (state == instructionState.fetch) {
      lineState = lineStates.fetchLines
    } else if(state == instructionState.decode) {
      lineState = lineStates.dec
    } else if(state == instructionState.execute){
        if (instruction == opcode.nop || (instruction == opcode.brz && accValue != 0) || (instruction == opcode.brnz && accValue == 0)) {lineState = lineStates.nop}
        else if(instruction == opcode.add || instruction == opcode.sub || instruction == opcode.mul) {lineState = lineStates.add_sub_mul_ex}
        else if (instruction == opcode.adda || instruction == opcode.suba) {lineState = lineStates.adda_suba_ex}
        else if (instruction == opcode.addx || instruction == opcode.subx) {lineState = lineStates.addx_subx_ex}
        else if (instruction == opcode.st) {lineState = lineStates.st_ex}
        else if(instruction == opcode.ld) {lineState = lineStates.ld_ex}
        else if(instruction == opcode.lda) {lineState = lineStates.lda_ex}
        else if(instruction == opcode.ldi) {lineState = lineStates.ldi_ex}
        else if(instruction == opcode.sta) {lineState = lineStates.sta_ex}
        else if(instruction == opcode.sti) {lineState = lineStates.sti_ex}
        else if(instruction == opcode.shl || instruction == opcode.shr) {lineState = lineStates.sh_ex}
        else if(instruction == opcode.br 
          || instruction == opcode.brz
          || instruction == opcode.brnz) 
        {lineState = lineStates.branching_ex} // Verifier si y'a vraiment un branchement
    }
    lineState
  }
//    "add" -> 0, "sub" -> 1, "mul" -> 2, "adda" -> 3, "suba" -> 4, "addx" -> 5, "subx" -> 6, "ld" -> 7, "st" -> 8,
//    "lda" -> 9, "sta" -> 10, "ldi" -> 11, "sti" -> 12, "br" -> 13, "brz" -> 14, "brnz" -> 15, "stop" -> 16, "nop" -> 17

  def setStimulatedLines(linesToSet: Array[Int], lines: Array[String]): Array[String] = {
    val toReturn = lines;
    for(line <- linesToSet){
      toReturn(line - 1) = "true"
    }
    toReturn
  }

  def getNumberOfInstructions(program: Array[String]): Int = {
    val opcodes = Array[String]("add", "sub", "mul", "adda", "suba", "addx", "subx", "ld", "st", "lda", "sta", "ldi", "sti", "br", "brz", "brnz", "stop", "nop")
    var numberOfInstructions = 0

    for(line <- program){

      val lineSplit = line.split(" ")
      var isInstruction = false

      for(opcode <- opcodes){
        if(lineSplit.contains(opcode)) {
          isInstruction = true
        }
      }
      if(isInstruction)
        numberOfInstructions = numberOfInstructions + 1
    }
    numberOfInstructions
  }

}

