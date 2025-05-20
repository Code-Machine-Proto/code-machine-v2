package accumulator

import chisel3._
import chisel3.util._

import scala.io.Source

object accumulator_compiler {

  val opcodeMapV2 = Map("add" -> 0, "sub" -> 1, "mul" -> 2, "adda" -> 3, "suba" -> 4, "addx" -> 5, "subx" -> 6, "ld" -> 7, "st" -> 8,
    "lda" -> 9, "sta" -> 10, "ldi" -> 11, "sti" -> 12, "br" -> 13, "brz" -> 14, "brnz" -> 15, "shl" -> 16, "shr" -> 17, "and" -> 18, "stop" -> 19, "nop" -> 20)
  val opcodeMapV1 = Map("add" -> 0, "sub" -> 1, "mul" -> 2, "st" -> 3, "ld" -> 4, "stop" -> 5, "nop" -> 6, "br" -> 7, "brz" -> 8, "brnz"-> 9)

  def getHexcodeProgram(program: Array[UInt]): Array[String] = {
    var toReturn = Array[String]()
    for(uint <- program){
      toReturn = toReturn :+ "0x" + uint.litValue().toInt.toHexString.toUpperCase
    }
    toReturn
  }

  def compileFromFilename(filename: String, version: Int): Array[UInt] = {
    compileFromArray(readProgramFromFile(filename), version)
  }

  def compileFromArray(instructionArray: Array[String], version: Int): Array[UInt] = {
    var toReturn = Array[UInt]()
    val programLines = removeComments(removeEmptyLinesAndSpaces(instructionArray))

    val textLines = parseTextAndData(programLines)(0)
    val dataLines = parseTextAndData(programLines)(1)

    val textLabelsMap = mapTextLabels(textLines)
    val dataLabelsMap = mapDataLabels(dataLines, textLines.length - textLabelsMap.size)
    val flatenedDataLines = flatDataLines(dataLines, dataLabelsMap, textLabelsMap, textLines.length - textLabelsMap.size)
    val flatenedTextLines = flatTextLines(textLines, dataLabelsMap, textLabelsMap)

    val UIntInstructions = parseStringInstructionToUInt(flatenedTextLines, version)
    val UIntData = parseStringDataToUInt(flatenedDataLines)

    System.out.println("Datalabel: " + dataLabelsMap.mkString(" "))
    System.out.println("Textlabel: " + textLabelsMap.mkString(" "))

    for(line <- UIntInstructions){
      toReturn = toReturn :+ line
    }
    for(line <- UIntData){
      toReturn = toReturn :+ line
    }

    toReturn
  }

  // RemoveComments should be called before removeEmptyLinesAndSpaces
  def removeComments(programLines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- programLines){
      if(line.contains("//")){
        if(line.trim.replaceAll(" +", "")(0) != '/'){
          var lineToAdd = ""
          var commentEncountered = false
          for(character <- line){
            if(character != '/' && !commentEncountered)
              lineToAdd = lineToAdd :+ character
            else
              commentEncountered = true
          }
          toReturn = toReturn :+ lineToAdd
        }
      }else{
        toReturn = toReturn :+ line
      }
    }
    toReturn
  }

  def removeEmptyLinesAndSpaces(programLines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- programLines){
      if(!line.matches("\\ +") && line.length != 0){
        toReturn = toReturn :+ line.trim().replaceAll(" +", " ")
      }
    }
    toReturn
  }

  def parseTextAndData(programLines: Array[String]): Array[Array[String]] = {
    var toReturn = Array[Array[String]]()
    var textLines = Array[String]()
    var dataLines = Array[String]()
    var textEncountered = false
    var dataEncountered = false
    for(line <- programLines){
      if(line == ".text")
        textEncountered = true
      if(line == ".data")
        dataEncountered = true
      if(textEncountered && !dataEncountered && line != ".text")
        textLines = textLines :+ line
      if(dataEncountered && line != ".data")
        dataLines = dataLines :+ line
    }
    toReturn = (toReturn :+ textLines) :+ dataLines
    toReturn
  }

  def readProgramFromFile(filename: String): Array[String] = {
    var toReturn = Array[String]()
    for(line <- Source.fromFile(filename).getLines){
      toReturn = toReturn :+ line
    }
    toReturn
  }

  def mapTextLabels(textLines: Array[String]): scala.collection.mutable.HashMap[String, Int] = {
    val toReturn = new scala.collection.mutable.HashMap[String, Int]()
    for(lineIdx <- 0 until textLines.length){
      if(textLines(lineIdx).contains(":")){
        toReturn.put(textLines(lineIdx).split(":")(0), lineIdx - toReturn.size)
      }
    }
    toReturn
  }

  def mapDataLabels(dataLines: Array[String], dataLinesStart: Int): scala.collection.mutable.HashMap[String, Int] = {
    val toReturn = new scala.collection.mutable.HashMap[String, Int]()
    var nbValues = dataLinesStart
    for(line <- dataLines){
      if(line.contains(":")){
        val dataLabel = line.split(":")(0)
        val values = line.split(":")(1).trim.replaceAll(" +", "").split(",")
        toReturn.put(dataLabel, nbValues)
        nbValues = nbValues + values.length
      }else{
        nbValues = nbValues + 1
      }
    }
    toReturn
  }

  def flatDataLines(dataLines: Array[String], dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int], dataLinesStart: Int): Array[String] = {
    var toReturn = Array[String]()
    for(line <- dataLines){
      if(line.contains(":")){
        val values = line.trim.replaceAll(" +", "").split(":")(1).trim.replaceAll(" +", "").split(",")
        for(value <- values) {
          toReturn = toReturn :+ value
        }
      }else{
        toReturn = toReturn :+ line
      }
    }

    for(idx <- 0 until toReturn.length){
      if(toReturn(idx).contains("+") && toReturn(idx).trim.replaceAll(" +", "").split("\\+")(0) != ""){
        toReturn(idx) = computeDataValue(toReturn(idx), "+", dataLabels, textLabels, toReturn, dataLinesStart)
      }else if(toReturn(idx).contains("-") && toReturn(idx).trim.replaceAll(" +", "").split("-")(0) != ""){
        //toReturn(idx) = computeDataValue(toReturn(idx), "-", dataLabels, textLabels, toReturn, dataLinesStart)
      }else if(toReturn(idx).contains("*") && toReturn(idx).trim.replaceAll(" +", "").split("\\*")(0) != ""){
        toReturn(idx) = computeDataValue(toReturn(idx), "*", dataLabels, textLabels, toReturn, dataLinesStart)
      }
    }
    toReturn
  }

  def flatTextLines(textLines: Array[String], dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- textLines){
      if(!line.contains(":")){
        toReturn = toReturn :+ line
      }
    }
    for(idx <- 0 until toReturn.length){
      if(toReturn(idx).contains("+")){
        toReturn(idx) = computeTextLabelAddress(toReturn(idx), "+", dataLabels, textLabels)
      }else if(toReturn(idx).contains("-")){
        toReturn(idx) = computeTextLabelAddress(toReturn(idx), "-", dataLabels, textLabels)
      }else if(toReturn(idx).contains("*")){
        toReturn(idx) = computeTextLabelAddress(toReturn(idx), "*", dataLabels, textLabels)
      }

      // Instruction different from stop / nope
      if(toReturn(idx).trim.replaceAll(" +", " ").split(" ").length > 1){
        val op = toReturn(idx).trim.replaceAll(" +", " ").split(" ")(0)
        val argument = toReturn(idx).trim.replaceAll(" +", " ").split(" ")(1)

        if(dataLabels.contains(argument)){
          toReturn(idx) = op + " " + dataLabels(argument).toString
        }else if(textLabels.contains(argument)){
          toReturn(idx) = op + " " + textLabels(argument).toString
        }
        // TODO: COULD PRODUCE ERROR COMPILATION IF argument IS NOT BE PRESENT IN DATA MAP OR TEXT MAP
      }
    }
    toReturn
  }

  def computeDataValue(line: String, operation: String, dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int], data: Array[String], dataLinesStart: Int): String = {
    var toReturn = ""
    var operationToCompute = operation
    if(operationToCompute == "+")
      operationToCompute = "\\" + "+"

    var leftOperand = line.trim.replaceAll(" +", "").split(operationToCompute)(0)
    var rightOperand = line.trim.replaceAll(" +", "").split(operationToCompute)(1)

    if(!isAllDigits(leftOperand)){
      if(dataLabels.contains(leftOperand)){
        leftOperand = dataLabels(leftOperand).toString
      }else if(textLabels.contains(leftOperand)){
        leftOperand = textLabels(leftOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

    if(!isAllDigits(rightOperand)){
      if(dataLabels.contains(rightOperand)){
        rightOperand = dataLabels(rightOperand).toString
      }else if(textLabels.contains(rightOperand)){
        rightOperand = textLabels(rightOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

//    if(operation == "+"){
//      toReturn = data((leftOperand.toInt + rightOperand.toInt) - dataLinesStart)
//    }else if(operation == "-"){
//      toReturn = data((leftOperand.toInt - rightOperand.toInt) - dataLinesStart)
//    }else if(operation == "*"){
//      toReturn = data((leftOperand.toInt * rightOperand.toInt) - dataLinesStart)
//    }
    if(operation == "+"){
      toReturn = (leftOperand.toInt + rightOperand.toInt).toString
    }else if(operation == "-"){
      toReturn = (leftOperand.toInt - rightOperand.toInt).toString
    }else if(operation == "*"){
      toReturn = (leftOperand.toInt * rightOperand.toInt).toString
    }
    toReturn
  }
  def computeTextLabelAddress(line: String, operation: String, dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int]): String = {
    var operationToCompute = operation
    if(operationToCompute == "+")
      operationToCompute = "\\" + "+"

    val expressionToCompute = line.trim.replaceAll(" +", " ").split(" ", 2)
    var toReturn = expressionToCompute(0) + " "
    var leftOperand = expressionToCompute(1).trim.replaceAll(" +", "").split(operationToCompute)(0)
    var rightOperand = expressionToCompute(1).trim.replaceAll(" +", "").split(operationToCompute)(1)

    if(!isAllDigits(leftOperand)){
      if(dataLabels.contains(leftOperand)){
        leftOperand = dataLabels(leftOperand).toString
      }else if(textLabels.contains(leftOperand)){
        leftOperand = textLabels(leftOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

    if(!isAllDigits(rightOperand)){
      if(dataLabels.contains(rightOperand)){
        rightOperand = dataLabels(rightOperand).toString
      }else if(textLabels.contains(rightOperand)){
        rightOperand = textLabels(rightOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

    if(operation == "+"){
      toReturn = toReturn + (leftOperand.toInt + rightOperand.toInt).toString
    }else if(operation == "-"){
      toReturn = toReturn +  (leftOperand.toInt - rightOperand.toInt).toString
    }else if(operation == "*"){
      toReturn = toReturn + (leftOperand.toInt * rightOperand.toInt).toString
    }
    toReturn
  }

  def isAllDigits(x: String): Boolean = {
    var isDigit = true
    for(character <- x){
      isDigit = isDigit & character.isDigit
    }
    isDigit
  }

  def parseStringDataToUInt(data: Array[String]): Array[UInt] = {
    var toReturn = Array[UInt]()
    for(line <- data){
      toReturn = toReturn :+ intToBinary16(Integer.parseInt(line.trim.replaceAll(" +", ""))).U(16.W)
    }
    toReturn
  }

  def parseStringInstructionToUInt(text: Array[String], version: Int): Array[UInt] = {
    var toReturn = Array[UInt]()
    for(line <- text){
      val operation = line.trim.replaceAll(" +", " ").split(" ")(0)
      if(operation == "stop" || operation == "nop" || operation == "ldi" || operation == "sti" || operation == "addx" || operation == "subx" || operation == "shl" || operation == "shr"){
        if(version == 1){
          toReturn = toReturn :+ (BigInt(opcodeMapV1(operation)) << 8 | BigInt(0)).U(16.W)
        }else if(version == 2){
          toReturn = toReturn :+ (BigInt(opcodeMapV2(operation)) << 8 | BigInt(0)).U(16.W)
        }
      }else{
        val arg = line.trim.replaceAll(" +", " ").split(" ")(1)
        if(version == 1){
          toReturn = toReturn :+ (BigInt(opcodeMapV1(operation)) << 8 | BigInt(arg)).U(16.W)
        }else if(version == 2){
          toReturn = toReturn :+ (BigInt(opcodeMapV2(operation)) << 8 | BigInt(arg)).U(16.W)
        }
      }
    }
    toReturn
  }

  def intToBinary16(value: Int): String = {
    var binaryString = value.toBinaryString
    if(value >= 0){
      while(binaryString.length < 16){
        binaryString = "0" + binaryString
      }
    }
    ("b" + binaryString.slice(binaryString.length - 16, binaryString.length))
  }
}
