package accumulator.accumulator_v1

import chisel3._
import chisel3.util.Enum

import scala.io.Source
import scala.reflect.ClassTag

object accumulator_v1_compiler {

  var labels = Map[String, Int]()
  var values = Map[String, Array[Int]]()
  var labelsValuesLengths = Map[String, Int]()

  val opcodeMap = Map("add" -> 0, "mul" -> 1, "st" -> 2, "ld" -> 3, "stop" -> 4, "nop" -> 5, "br" -> 6, "brz" -> 7, "brnz"-> 8)
  val add :: mul :: st :: ld :: stop :: nop :: br :: brz :: brnz :: Nil = Enum(9)
  val fetch :: decode :: execute :: preload :: Nil = Enum(4)

  def getHexCode(programFilename: String): Array[String] = {

    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = removeDirectives(formatSpaces(removeEmptyLines(readFile(programFilename))))

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        for(labelValue <- values(key)){
          instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
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

  def getHexCodeFromArray(program: Array[String]): Array[String] = {

    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = removeDirectives(formatSpaces(removeEmptyLines(program)))

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        for(labelValue <- values(key)){
          instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
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

  def getHexCodeParam(arguments: Array[String]): Array[String] = {

    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = removeDirectives(formatSpaces(removeEmptyLines(arguments)))

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        for(labelValue <- values(key)){
          instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
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

  def compile(programFilename: String): Array[UInt] = {

    var instructionsUInt = Array[UInt]()
    var instructionsHex = Array[String]()
    var instructionsString = Array[String]()

    instructionsString = removeDirectives(formatSpaces(removeEmptyLines(readFile(programFilename))))

    labels = mapLabelAddress(instructionsString)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        for(labelValue <- values(key)){
          instructionsUInt = instructionsUInt :+ labelValue.U(16.W)
          instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
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
            instructionsUInt = instructionsUInt :+ (instruction.toInt).U(16.W)
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

    // labelsValuesLengths = mapLabelsValuesLength(instructionsString);
    labels = mapLabelAddress(instructionsString);
    values = mapValues(instructionsString);
    printMap(labels)

    for(index <- 0 until instructionsString.length){
      var instruction = instructionsString(index)

      // label: value1, value2, value3, ... valueN
      if(instruction.contains(":")){
        val key = instruction.split(":")(0)
        for(labelValue <- values(key)){
          instructionsUInt = instructionsUInt :+ labelValue.U(16.W)
          instructionsHex = instructionsHex :+ "0x" + labelValue.toHexString.toUpperCase
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
            instructionsUInt = instructionsUInt :+ (instruction.toInt).U(16.W)
            instructionsHex = instructionsHex :+ "0x" + (instruction.toInt).toHexString.toUpperCase
          }

        }
      }

    }
    instructionsUInt
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

  def removeDirectives(lines: Array[String]): Array[String] = {
    var toReturn = Array[String]();
    val directives = Array[String](".text", ".data");

    for(line <- lines){
      var isDirective = false;
      for(directive <- directives){
        if(line.toLowerCase.contains(directive))
          isDirective = true;
      }
      if(!isDirective)
        toReturn = toReturn :+ line;
    }

    toReturn
  }

  def mapLabels(lines: Array[String]): Map[String, Int] = {

    val labelsValuesLength = mapLabelsValuesLength(lines)
    var labels = Map[String, Int]()
    var nInstructionLabels = 0

    for(index <- 0 until lines.length){
      val line = lines(index)
      if(isEmptyLabel(index, lines)) nInstructionLabels = nInstructionLabels + 1

      if(line.matches(".+:.+") || line.matches(".+:.*")){
        val label = line.split(":")(0)
        System.out.println(label)

        var address = index + computeOffset(label, labelsValuesLength)
        address = address - (nInstructionLabels)

        if(isEmptyLabel(index, lines)) address = address + 1
        labels = labels + (label -> address)
      }
    }
    labels
  }

  def mapValues(lines: Array[String]): Map[String, Array[Int]] = {
    var values = Map[String, Array[Int]]()
    for(line <- lines){
      if(line.matches(".+:.+")){
        val label = line.split(":")(0)
        val stringArray = line.split(":")(1).split(",")
        var intArray = Array[Int]()
        for(element <- stringArray){

          val elementTrimmed = element.trim().replaceAll(" +", "");

//          intArray = intArray :+ elementTrimmed.toInt

          // Either a number (ex: abc: 1)
          if(stringIsDigit(elementTrimmed)){
            intArray = intArray :+ elementTrimmed.toInt
          }
          // Or a label (ex: abc: d), but the referenced label should be declared before the reference of the label
          else{

            if(elementTrimmed.contains("+")){
              val label = elementTrimmed.split("\\+")(0)
              val offset = elementTrimmed.split("\\+")(1)
              intArray = intArray :+ values(label)(offset.toInt)
            }else if(elementTrimmed.contains("-")){
              val label = elementTrimmed.split("-")(0)
              val offset = elementTrimmed.split("-")(1)
              // Should implement - (MINUS)
            }else if(elementTrimmed.contains("*")){
              val label = elementTrimmed.split("\\*")(0)
              val offset = elementTrimmed.split("\\*")(1)
              // Should implement * (MULTIPLY)
            }else{
              intArray = intArray :+ values(elementTrimmed)(0)
            }
          }
        }

        values = values + (label -> intArray)
      }else if(line.matches(".+:.*")){
        val label = line.split(":")(0)
        values = values + (label -> Array[Int]())
      }
    }
    values
  }

  def mapLabelsValuesLength(lines: Array[String]): Map[String, Int] = {
    var labelsValuesLength = Map[String, Int]()
    for(line <- lines){
      if(line.matches(".+:.+")){
        val label = line.split(":")(0)
        val stringArray = line.split(":")(1).split(",")

        labelsValuesLength = labelsValuesLength + (label -> stringArray.length)
      }
    }
    labelsValuesLength
  }

  def stringIsDigit(string: String): Boolean = {
    var isDigit = true
    for(character <- string){
      isDigit = isDigit && character.isDigit
    }
    isDigit
  }

  def mapLabelAddress(lines: Array[String]): Map[String, Int] = {
    mapLabels(lines)
  }

  def getOpcode(instruction: String): Int = {
    opcodeMap(instruction.split(" ")(0))
  }

  def computeIndexes(instruction: String, map: Map[String, Int]): Int = {

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

  def computeOffset(key: String, map: Map[String, Int]): Int = {
    var offset = 0
    if(map.contains(key)){
      var index = 0
      for((keyValue, length) <- map){
        if (keyValue != key){
          offset = offset + length
        }else{
          return offset - index
        }
        index = index + 1
      }
    }
    offset
  }

  def isEmptyLabel(index: Int, instructions: Array[String]): Boolean = {
    val instruction = instructions(index)
    if(index < instructions.length - 1 && !opcodeMap.contains(instruction.split(" ")(0))){
      instruction.split(":").length == 1
    }else{
      false
    }
  }

  def printArray[T: ClassTag](array: Array[T]): Unit = {
    for(element <- array){
      println(element.toString)
    }
  }

  def printMap[keyType: ClassTag, valueType: ClassTag](map: Map[keyType, valueType]): Unit = {
    for((key, value) <- map){
      println(key.toString + " -> " + value.toString)
    }
  }

  def getStimulatedLines(instruction: Int, state: Int): Array[String] = {
    // Could use setStimulatedLines

    val fetch = 0
    val decode = 1
    val execute = 2

    val addInt = 0
    val mulInt = 1
    val stInt = 2
    val ldInt = 3
    val stopInt = 4
    val nopInt = 5
    val brInt = 6
    val brzInt = 7
    val brnzInt = 8

    val nLines = 31

    var lines = Array[String]()

    for(i <- 1 to nLines){
      lines = lines :+ "false"
    }

    if(state == fetch){
      // Goes to opcode "box" producing control signals and IR register
      // Should not pass through the ACC
      // TODO: Add more lines
      lines = setStimulatedLines(Array(3, 4, 5, 6, 7, 19, 20), lines)
    }else if(state == decode){
      // Not a label or a directive
      if(instruction != nopInt && instruction != stopInt){
        lines = setStimulatedLines(Array(26, 14, 23, 17, 27), lines)

        if(instruction == addInt || instruction == mulInt){
          lines = setStimulatedLines(Array(24, 25, 5, 6, 9, 12, 13, 14, 23, 15, 19, 20, 21, 22), lines)
        }else if(instruction == ldInt){
          lines = setStimulatedLines(Array(24, 25, 5, 6, 8, 13, 19, 20, 22), lines)
        }else if(instruction == stInt){
          lines = setStimulatedLines(Array(24, 25, 5, 14, 16, 19, 20), lines)
        }
      }
    }else if(state == execute){
      // Not a label or a directive
      if((instruction == brInt || instruction == brzInt || instruction == brnzInt)){
        // TODO: Add corresponding lines on the diagram for PC <= value
        lines = setStimulatedLines(Array(24, 26, 28, 29, 31), lines)
      }else{
        if(instruction != nopInt && instruction != stopInt){
          lines = setStimulatedLines(Array(1, 2, 3, 29), lines)
        }
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
    val opcodes = Array[String]("add", "mul", "st", "ld", "stop", "nop", "br", "brz", "brnz")
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

