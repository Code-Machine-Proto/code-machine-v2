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

  def getStimulatedLines(instruction: Int, state: Int): Array[String] = {

//    "add" -> 0, "sub" -> 1, "mul" -> 2, "adda" -> 3, "suba" -> 4, "addx" -> 5, "subx" -> 6, "ld" -> 7, "st" -> 8,
//    "lda" -> 9, "sta" -> 10, "ldi" -> 11, "sti" -> 12, "br" -> 13, "brz" -> 14, "brnz" -> 15, "stop" -> 16, "nop" -> 17

    val fetch = 0
    val decode = 1
    val execute = 2

    val addInt = 0
    val subInt = 1
    val mulInt = 2
    val addaInt = 3
    val subaInt = 4
    val addxInt = 5
    val subxInt = 6
    val ldInt = 7
    val stInt = 8
    val ldaInt = 9
    val staInt = 10
    val ldiInt = 11
    val stiInt = 12
    val brInt = 13
    val brzInt = 14
    val brnzInt = 15
    val stopInt = 16
    val nopInt = 17

    var lines = Array[String](
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false"
    )

    if(state == fetch){
      lines = setStimulatedLines(Array(3, 4, 5, 37, 38, 6, 7), lines)
    }else if(state == decode){
      // Not a label or a directive

      if(instruction != nopInt && instruction != stopInt){
        lines = setStimulatedLines(Array(32, 33, 18, 21, 42), lines)
      }

      if(instruction == addInt || instruction == subInt || instruction == mulInt){
        lines = setStimulatedLines(Array(31, 32, 28, 37, 5, 38, 6, 9, 12, 13, 11, 17, 18, 42, 24, 39, 26, 40), lines)
      }else if(instruction == addaInt || instruction == subaInt){
        lines = setStimulatedLines(Array(32, 31, 28, 37, 5, 38, 6, 9, 12, 14, 41, 16, 19, 20, 25, 39, 26, 40), lines)
      }else if(instruction == addxInt || instruction == subxInt){
        lines = setStimulatedLines(Array(19, 20, 27, 37, 5, 38, 6, 9, 40, 12, 13, 11, 17, 18, 42, 24, 39, 26), lines)
      }else if(instruction == stInt){
        lines = setStimulatedLines(Array(18, 22, 36, 34, 38, 32, 31, 28, 37, 5), lines)
      }else if(instruction == ldInt){
        lines = setStimulatedLines(Array(32, 31, 28, 37, 5, 38, 6, 8, 10, 11, 17), lines)
      }else if(instruction == staInt){
        lines = setStimulatedLines(Array(32, 31, 28, 37, 5, 38, 19, 23, 36, 34), lines)
      }else if(instruction == ldaInt){
        lines = setStimulatedLines(Array(32, 31, 28, 37, 5, 38, 6, 8, 15, 41, 16), lines)
      }else if(instruction == stiInt){
        lines = setStimulatedLines(Array(19, 20, 27, 37, 5, 38, 18, 22, 36, 34), lines)
      }else if(instruction == ldiInt){
        lines = setStimulatedLines(Array(19, 20, 27, 37, 5, 38, 6, 8, 10, 11, 17), lines)
      }

    }else if(state == execute){
      if(instruction == brInt || instruction == brnzInt || instruction == brzInt){
        lines = setStimulatedLines(Array(32, 31, 29, 35, 30), lines)
      }else if(instruction != nopInt && instruction != stopInt) {
        lines = setStimulatedLines(Array(3, 2, 1, 35, 30), lines)
      }
    }
    lines
  }

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

