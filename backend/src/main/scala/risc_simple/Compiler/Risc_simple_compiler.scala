package risc_simple.compiler

import chisel3._
import chisel3.util._
import scala.io.Source
import scala.language.postfixOps
object asm_compiler {

  val opcodeMap = Map("add" -> 0, "sub" -> 1, "shr" -> 2, "shl" -> 3, "not" -> 4, "and" -> 5, "or" -> 6,"mv" -> 7, "ld" -> 8, "st"-> 9,"ldi"-> 10,"br"-> 12,"brz"-> 12,"brnz"-> 12,"brlz"-> 12,"brgez"-> 12,"stop"-> 15)
  
  object lineStates {
    val lineError    = -1
    val fetchLines   = 0
    val decode       = 1
    val opTwoReg     = 2
    val opThreeReg   = 3
    val ld           = 4
    val st           = 5
    val ldi          = 6
    val branching_ex = 7
    val nop          = 8
  }

  object instructionState {
    val start = 0
    val fetch = 1
    val decode = 2
    val execute = 3
  }

  // One call function
  def compile_for_print_text(filename: String): Array[String] = {
    getHexcodeProgram(compileFromArray_text(readProgramFromFile(filename)))
  }

  def compile_for_backend_text(filename: String): Array[UInt] = {
    compileFromArray_text(readProgramFromFile(filename))
  }

  def compile_for_print_data(filename: String): Array[String] = {
    getHexcodeProgram(compileFromArray_data(readProgramFromFile(filename)))
  }

  def compile_for_backend_data(filename: String): Array[UInt] = {
    compileFromArray_data(readProgramFromFile(filename))
  }

  // ---------------------------------------------------------------------
  // Hex correpondance of UInt

  def getHexcodeProgram(program: Array[UInt]): Array[String] = {
    var toReturn = Array[String]()
    for(uint <- program){
      toReturn = toReturn :+ "0x" + uint.litValue().toInt.toHexString.toUpperCase
    }
    toReturn
  }

  // ----------------------------------------------------------------------
  // 4- Compilation functions

  def compileFromArray_text(instructionArray: Array[String]): Array[UInt] = {
    var toReturn = Array[UInt]()
    val programLines = removeComments(adjustComma(removeEmptyLinesAndSpaces(instructionArray)))

    val textLines = parseTextAndData(programLines)(0)
    val dataLines = parseTextAndData(programLines)(1)

    val textLabelsMap = mapTextLabels(textLines)
    val dataLabelsMap = mapDataLabels(dataLines, textLines.length - textLabelsMap.size)
    val flatenedDataLines = flatDataLines(dataLines, dataLabelsMap, textLabelsMap, textLines.length - textLabelsMap.size)
    val flatenedTextLines = flatTextLines(textLines, dataLabelsMap, textLabelsMap)

    val UIntInstructions = parseStringInstructionToUInt(flatenedTextLines)

    for(line <- UIntInstructions){
      toReturn = toReturn :+ line.asUInt()
    }
    toReturn
  }


  def compileFromArray_data(instructionArray: Array[String]): Array[UInt] = {
    var toReturn = Array[UInt]()
    val programLines = removeComments(adjustComma(removeEmptyLinesAndSpaces(instructionArray)))

    val textLines = parseTextAndData(programLines)(0)
    val dataLines = parseTextAndData(programLines)(1)

    val textLabelsMap = mapTextLabels(textLines)
    val dataLabelsMap = mapDataLabels(dataLines, textLines.length - textLabelsMap.size)
    val flatenedDataLines = flatDataLines(dataLines, dataLabelsMap, textLabelsMap, textLines.length - textLabelsMap.size)
    val flatenedTextLines = flatTextLines(textLines, dataLabelsMap, textLabelsMap)

    val UIntData = parseStringDataToUInt(flatenedDataLines)

    for(line <- UIntData){
      toReturn = toReturn :+ line.asUInt()
    }

    toReturn
  }

  def compileFromArray(instructionArray: Array[String]): Array[UInt] = {
    var toReturn = Array[UInt]()
    val programLines = removeComments(removeEmptyLinesAndSpaces(instructionArray))

    val textLines = parseTextAndData(programLines)(0)
    val dataLines = parseTextAndData(programLines)(1)

    val textLabelsMap = mapTextLabels(textLines)
    val dataLabelsMap = mapDataLabels(dataLines, textLines.length - textLabelsMap.size)
    val flatenedDataLines = flatDataLines(dataLines, dataLabelsMap, textLabelsMap, textLines.length - textLabelsMap.size)
    val flatenedTextLines = flatTextLines(textLines, dataLabelsMap, textLabelsMap)

    val UIntInstructions = parseStringInstructionToUInt(flatenedTextLines)
    val UIntData = parseStringDataToUInt(flatenedDataLines)

    for(line <- UIntInstructions){
      toReturn = toReturn :+ line
    }
    for(line <- UIntData){
      toReturn = toReturn :+ line
    }

    toReturn
  }
  // ----------------------------------------------------------------------
  // 2- Clean the Array[String] (remove comments)
  // Should be called before removeEmptyLinesAndSpaces

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

  // ---------------------------------------------------------------------
  // 3- Clean the Array[String] (remove empty lines & spaces & adjust comma)

  def removeEmptyLinesAndSpaces(programLines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- programLines){
      if(!line.matches("\\ +") && line.length != 0){
        toReturn = toReturn :+ line.trim().replaceAll(" +", " ")
      }
    }
    toReturn
  }

  def adjustComma(programLines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- programLines){
      if(line.contains(",")){
        var op = line.trim.replaceAll(" +", " ").split(" ")(0)
        var argumentComma = line.trim.replaceAll(" +", " ").split(" ",2)(1)
        var argumentCommaAdjus = argumentComma.trim.replaceAll(" +", "")

        toReturn = toReturn :+ op + " " + argumentCommaAdjus
      }
      else{
        toReturn = toReturn :+ line
      }
    }
    toReturn
  }

  // ---------------------------------------------------------------------
  // Seperate Array[String] into text part and data part

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

  // ---------------------------------------------------------------------
  // 1- ASM File -> Array[String] (each String is a line)

  def readProgramFromFile(filename: String): Array[String] = {
    var toReturn = Array[String]()
    for(line <- Source.fromFile(filename).getLines){
      toReturn = toReturn :+ line
    }
    toReturn
  }

  // ---------------------------------------------------------------------
  // map etiquettes of asm code into the hash table ( the value is the adress of the next line after etiquette )

  def mapTextLabels(textLines: Array[String]): scala.collection.mutable.HashMap[String, Int] = {
    val toReturn = new scala.collection.mutable.HashMap[String, Int]()
    for(lineIdx <- 0 until textLines.length){
      if(textLines(lineIdx).contains(":")){
        toReturn.put(textLines(lineIdx).split(":")(0), lineIdx - toReturn.size) // next line
      }
    }
    toReturn
  }

  // ---------------------------------------------------------------------
  // map etiquettes of data part into hash table (the value is the adress of the line where data is declared , the first adress is the last text adress without lables +1)

  def mapDataLabels(dataLines: Array[String], dataLinesStart: Int): scala.collection.mutable.HashMap[String, Int] = {
    val toReturn = new scala.collection.mutable.HashMap[String, Int]()
    var nbValues = 0             //(dataLineStart is the adress where data values will start , right after text without etiquettes)
    for(line <- dataLines){
      if(line.contains(":")){
        val dataLabel = line.split(":")(0)
        val values = line.split(":")(1).trim.replaceAll(" +", "").split(",")
        toReturn.put(dataLabel, nbValues)
        nbValues = nbValues + values.length   //next data address line
      }else{
        nbValues = nbValues + 1              //next data address line
      }
    }
    toReturn
  }

  // ---------------------------------------------------------------------

  def flatDataLines(dataLines: Array[String], dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int], dataLinesStart: Int): Array[String] = {
    var toReturn = Array[String]()

    //isolate data values ( wiht & without data etiquette)
    for(line <- dataLines){
      if(line.contains(":")){
        val values = line.trim.replaceAll(" +", "").split(":")(1).trim.replaceAll(" +", "").split(",")   // delete etiquette to isolate data values to put into memory
        for(value <- values) {
          toReturn = toReturn :+ value   // array containing data values sequencetly ( can be with data etiquette or not)
        }
      }else{
        //TODO Error if we have a sequence of array (7,6,0) without an etiquette // is it even correct to do so ?
        toReturn = toReturn :+ line
      }
    }

    // Treat the case of data values containing data etiquette with an operation
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

  // -------------------------------------------------------------------
  // make the text part with no etiquettes , and convert arguments (containing etiquette of a branch or data reference ) in the text part into the corespondant address

  def flatTextLines(textLines: Array[String], dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int]): Array[String] = {
    var toReturn = Array[String]()

    //remove etiquettes from text part
    for(line <- textLines){
      if(!line.contains(":")){
        toReturn = toReturn :+ line
      }
    }

    // replace all argument in text part containing etiquette (with or without operation) with their correspondant addresses

    for(idx <- 0 until toReturn.length){

      // Instruction with an argument & an operation included       (Except stop / nope)

      if(toReturn(idx).contains("+")){
        toReturn(idx) = computeTextLabelAddress(toReturn(idx), "+", dataLabels, textLabels)   //return the line with calculated address
      }else if(toReturn(idx).contains("-")){
        toReturn(idx) = computeTextLabelAddress(toReturn(idx), "-", dataLabels, textLabels)  //return the line with calculated address
      }else if(toReturn(idx).contains("*")){
        toReturn(idx) = computeTextLabelAddress(toReturn(idx), "*", dataLabels, textLabels)  //return the line with calculated address
      }

      // Instruction with an argument containing an etiquette only , i.e no operation included in the argument      (Except stop / nope)

      if(toReturn(idx).trim.replaceAll(" +", " ").split(" ").length > 1){

        val op = toReturn(idx).trim.replaceAll(" +", " ").split(" ")(0)
        val argument = toReturn(idx).trim.replaceAll(" +", " ").split(" ")(1)

        if (argument.contains(",")){
          val Reg = argument.trim.replaceAll(" +", "").split(",",2)(0)
          val Imm = argument.trim.replaceAll(" +", "").split(",",2)(1)

          if(dataLabels.contains(Imm)){
            toReturn(idx) = op + " " + Reg + "," + dataLabels(Imm).toString    //it adress from the datalabel hashmap
          }
        }

        else{

          // if argument is a data-etiquette or text-etiquette , we look into their hash map to know the value (which is the adress)
          if(dataLabels.contains(argument)){
            toReturn(idx) = op + " " + dataLabels(argument).toString    //it adress from the datalabel hashmap
          }else if(textLabels.contains(argument)){
            toReturn(idx) = op + " " + textLabels(argument).toString    //it adress from the textlabel hashmap
          }
        }
        // TODO: COULD PRODUCE ERROR COMPILATION IF argument IS NOT BE PRESENT IN DATA MAP OR TEXT MAP
      }
    }
    toReturn
  }

  // -------------------------------------------------------------------
  // if instruction in data part with values containing an etiquette have an operation (+ - *) , we convert it to a line with its correspondant address

  def computeDataValue(line: String, operation: String, dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int], data: Array[String], dataLinesStart: Int): String = {
    var toReturn = ""
    var operationToCompute = operation
    if(operationToCompute == "+")
      operationToCompute = "\\" + "+"

    var leftOperand = line.trim.replaceAll(" +", "").split(operationToCompute)(0)
    var rightOperand = line.trim.replaceAll(" +", "").split(operationToCompute)(1)

    //is the left operand an etiquette or a number?
    //we treat the etiquette case only (give the etiquette the correspondant adress from the data hash map table)
    //text lable here doesnt make sense ??
    if(!isAllDigits(leftOperand)){
      if(dataLabels.contains(leftOperand)){
        leftOperand = dataLabels(leftOperand).toString
      }else if(textLabels.contains(leftOperand)){        // doesnt make sense ?? we're on the data part ( I dont see any use of it )
        leftOperand = textLabels(leftOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

    //is the right operand an etiquette or a number?
    //we treat the etiquette case only (give the etiquette the correspondant adress from the data hash map table)
    //text lable here doesnt make sense ??
    if(!isAllDigits(rightOperand)){
      if(dataLabels.contains(rightOperand)){
        rightOperand = dataLabels(rightOperand).toString
      }else if(textLabels.contains(rightOperand)){        // doesnt make sense ?? we're on the data part ( I dont see any use of it )
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

    // Do the operation and return the line wiht it final address calculated
    if(operation == "+"){
      toReturn = (leftOperand.toInt + rightOperand.toInt).toString
    }else if(operation == "-"){
      toReturn = (leftOperand.toInt - rightOperand.toInt).toString
    }else if(operation == "*"){
      toReturn = (leftOperand.toInt * rightOperand.toInt).toString
    }
    toReturn
  }

  // -------------------------------------------------------------------
  // if instruction with argument containing an etiquette have an operation (+ - *) , we convert it to a line with its correspondant address

  def computeTextLabelAddress(line: String, operation: String, dataLabels: scala.collection.mutable.HashMap[String, Int], textLabels: scala.collection.mutable.HashMap[String, Int]): String = {
    var operationToCompute = operation
    if(operationToCompute == "+")
      operationToCompute = "\\" + "+"

    val expressionToCompute = line.trim.replaceAll(" +", " ").split(" ", 2)
    var toReturn = expressionToCompute(0) + " "
    var leftOperand = expressionToCompute(1).trim.replaceAll(" +", "").split(operationToCompute)(0)
    var rightOperand = expressionToCompute(1).trim.replaceAll(" +", "").split(operationToCompute)(1)

    //is the left operand an etiquette or a number?
    //we treat the etiquette case only (give the etiquette the correspondant adress from the hash table whether its in text or data)
    if(!isAllDigits(leftOperand)){
      if(dataLabels.contains(leftOperand)){
        leftOperand = dataLabels(leftOperand).toString
      }else if(textLabels.contains(leftOperand)){
        leftOperand = textLabels(leftOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

    ////is the right operand an etiquette or a number?
    //we treat the etiquette case only (give the etiquette the correspondant adress from the hash table whether its in text or data)
    if(!isAllDigits(rightOperand)){
      if(dataLabels.contains(rightOperand)){
        rightOperand = dataLabels(rightOperand).toString
      }else if(textLabels.contains(rightOperand)){
        rightOperand = textLabels(rightOperand).toString
      }
      // TODO: COULD PRODUCE ERROR COMPILATION IF LABEL IS NOT IN DATALABELS NOR TEXTLABELS
    }

    // Do the operation and return the line wiht it final address calculated
    if(operation == "+"){
      toReturn = toReturn + (leftOperand.toInt + rightOperand.toInt).toString
    }else if(operation == "-"){
      toReturn = toReturn +  (leftOperand.toInt - rightOperand.toInt).toString
    }else if(operation == "*"){
      toReturn = toReturn + (leftOperand.toInt * rightOperand.toInt).toString
    }
    toReturn
  }

  // ------------------------------------------------------------------
  // See if a string is an etiquette or number

  def isAllDigits(x: String): Boolean = {
    var isDigit = true
    for(character <- x){
      isDigit = isDigit & character.isDigit
    }
    isDigit
  }

  // -------------------------------------------------------------------
  //UInt correpondance of data part   (16bit)

  def parseStringDataToUInt(data: Array[String]): Array[UInt] = {
    var toReturn = Array[UInt]()
    for(line <- data){
      toReturn = toReturn :+ intToBinary16(Integer.parseInt(line.trim.replaceAll(" +", ""))).U(16.W)
    }
    toReturn
  }

  // -------------------------------------------------------------------
  // UInt correpondance of text part   (16bit)
  /*
    def parseStringInstructionToUInt(text: Array[String], version: Int): Array[UInt] = {
      var toReturn = Array[UInt]()
      for(line <- text){
        val operation = line.trim.replaceAll(" +", " ").split(" ")(0)

        // operation that dont have an argument , directly to hex correpondance
        if(operation == "stop" || operation == "nop" || operation == "ldi" || operation == "sti" || operation == "addx" || operation == "subx" || operation == "shl" || operation == "shr"){
          if(version == 1){
            toReturn = toReturn :+ (BigInt(opcodeMap(operation)) << 8 | BigInt(0)).U(16.W)
          }else if(version == 2){
            toReturn = toReturn :+ (BigInt(opcodeMap(operation)) << 8 | BigInt(0)).U(16.W)
          }
        }
        //operation that have an argument , Hex correpondance
        else{
          val arg = line.trim.replaceAll(" +", " ").split(" ")(1)
          if(version == 1){
            toReturn = toReturn :+ (BigInt(opcodeMap(operation)) << 8 | BigInt(arg)).U(16.W)
          }else if(version == 2){
            toReturn = toReturn :+ (BigInt(opcodeMap(operation)) << 8 | BigInt(arg)).U(16.W)
          }
        }
      }
      toReturn
    }
    */
  def parseStringInstructionToUInt(text: Array[String]): Array[UInt] = {
    var toReturn = Array[UInt]()
    for(line <- text){

      val operation = line.trim.replaceAll(" +", " ").split(" ")(0)
      var Hex = UInt(28.W)  //output

      // Hex correpondance of operations with no argument  (Stop)
      if(operation == "stop"){
        var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
        Hex = opCodeSection.U(28.W)
        toReturn = toReturn :+ Hex
      }

      // Hex correpondance of operations with arguments
      else{
        val arg = line.trim.replaceAll(" +", " ").split(" ",2)(1) // The argument

        // ------------------1 argument  (br,brz,brnz,brlz,brgez)
        if(operation == "br"){
          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var jtypeSection  = BigInt(0) << 16
          var disp = BigInt(arg)
          Hex = (opCodeSection | jtypeSection | disp).U(28.W)
          toReturn = toReturn :+ Hex
        }

        if(operation == "brz"){
          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var jtypeSection  = BigInt(1) << 16
          var disp = BigInt(arg)
          Hex = (opCodeSection | jtypeSection | disp).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "brnz"){
          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var jtypeSection  = BigInt(2) << 16
          var disp = BigInt(arg)
          Hex = (opCodeSection | jtypeSection | disp).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "brlz"){
          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var jtypeSection  = BigInt(3) << 16
          var disp = BigInt(arg)
          Hex = (opCodeSection | jtypeSection | disp).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "brgez"){
          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var jtypeSection  = BigInt(4) << 16
          var disp = BigInt(arg)
          Hex = (opCodeSection | jtypeSection | disp).U(28.W)
          toReturn = toReturn :+ Hex
        }

        // --------------- 2 arguments  (shr,shl,not,mv,ld,st,ldi,)

        if(operation == "shr"){
          val regDst = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          Hex = (opCodeSection | rdst | rsrc1).U(28.W)
          toReturn = toReturn :+ Hex
        }

        if(operation == "shl"){
          val regDst = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          Hex = (opCodeSection | rdst | rsrc1).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "not"){
          val regDst = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          Hex = (opCodeSection | rdst | rsrc1).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "mv"){
          val regDst = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          Hex = (opCodeSection | rdst | rsrc1).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "ld"){
          val regDst = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val temp   = arg.trim.replaceAll(" +", "").split(",")(1)    // (r5)
          val temp1 = temp.trim.replaceAll("\\(", "")                 // r5)
          val temp2 = temp1.trim.replaceAll("\\)", "")                // r5
          val regSrc1 = temp2.split("r")(1)                           // 5

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          Hex = (opCodeSection | rdst | rsrc1).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "st"){
          val regSrc2 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)
          val temp3   = arg.trim.replaceAll(" +", "").split(",")(0)    // (r5)
          val temp4 = temp3.trim.replaceAll("\\(", "")                 // r5)
          val temp5 = temp4.trim.replaceAll("\\)", "")                // r5
          val regDst = temp5.split("r")(1)                           // 5

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 8
          var rsrc2 = BigInt(regSrc2)
          Hex = (opCodeSection | rdst | rsrc2).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "ldi"){
          val regDst = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val immVal = arg.trim.replaceAll(" +", "").split(",")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var imm = BigInt(immVal)                                          //
          Hex = (opCodeSection | rdst | imm).U(28.W)
          toReturn = toReturn :+ Hex
        }

        // --------------------- 3 arguments  (add,sub,and,or)

        if(operation == "add"){
          val regDst  = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)
          val regSrc2 = arg.trim.replaceAll(" +", "").split(",")(2).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          var rsrc2 = BigInt(regSrc2)
          Hex = (opCodeSection | rdst | rsrc1 |rsrc2).U(28.W)
          toReturn = toReturn :+ Hex
        }

        if(operation == "sub"){
          val regDst  = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)
          val regSrc2 = arg.trim.replaceAll(" +", "").split(",")(2).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          var rsrc2 = BigInt(regSrc2)
          Hex = (opCodeSection | rdst | rsrc1 |rsrc2).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "and"){
          val regDst  = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)
          val regSrc2 = arg.trim.replaceAll(" +", "").split(",")(2).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          var rsrc2 = BigInt(regSrc2)
          Hex = (opCodeSection | rdst | rsrc1 |rsrc2).U(28.W)
          toReturn = toReturn :+ Hex
        }
        if(operation == "or"){
          val regDst  = arg.trim.replaceAll(" +", "").split(",")(0).split("r")(1)
          val regSrc1 = arg.trim.replaceAll(" +", "").split(",")(1).split("r")(1)
          val regSrc2 = arg.trim.replaceAll(" +", "").split(",")(2).split("r")(1)

          var opCodeSection = (BigInt(opcodeMap(operation)) << 24 | BigInt(0))
          var rdst  = BigInt(regDst) << 16
          var rsrc1 = BigInt(regSrc1) << 8
          var rsrc2 = BigInt(regSrc2)
          Hex = (opCodeSection | rdst | rsrc1 |rsrc2).U(28.W)
          toReturn = toReturn :+ Hex
        }
      }
    }
    toReturn
  }

  // --------------------------------------------------------------------
  // to make possible negative values in data part

  def intToBinary16(value: Int): String = {
    var binaryString = value.toBinaryString
    if(value >= 0){
      while(binaryString.length < 16){
        binaryString = "0" + binaryString
      }
    }
    ("b" + binaryString.slice(binaryString.length - 16, binaryString.length))
  }
  
  
  val MSB = 27
  val opcodeMSB     = 1 << MSB
  
  // Instruction base opcodes
  val read_mem   = opcodeMSB
  val write_mem  = opcodeMSB | (1 << 24)
  val ldi        = opcodeMSB | (1 << 25)
  val jump       = opcodeMSB | (1 << 26)
  val stop       = opcodeMSB | (1 << 26) | (1 << 25) | (1 << 24)
  
  val lastPartMask = (1 << 27) | (1 << 26) | (1 << 25) | (1 << 24)
  
  // ALU operation subcodes (added to base)
  val opAdd = 0
  val opSub = 1 << 24
  val opShr = 1 << 25
  val opShl = (1 << 25) | (1 << 24)
  val opNot = 1 << 26
  val opAnd = (1 << 26) | (1 << 24)
  val opOr  = (1 << 26) | (1 << 25)
  val opMv  = (1 << 26) | (1 << 25) | (1 << 24)
  
  // Jump condition codes (used with `jump`)
  val jumpNo    = 0
  val jumpZ     = 1 << 24
  val jumpNZ    = 1 << 25
  val jumpNeg   = (1 << 25) | (1 << 24)
  val jumpNeNeg = 1 << 26
  
  val jTypeMask = (1 << 19) | (1 << 18) | (1 << 17) | (1 << 16)
  
  // CPU flags
  val flagZ = 1
  val flagN = 2

  def getStimulatedLines(instruction: Int, state: Int, flagNZ: Int): Int = {
    var opALU = 1
    var lineState = lineStates.lineError
    if(state == instructionState.fetch){
      lineState = lineStates.fetchLines
    } else if (state == instructionState.decode){
      lineState = lineStates.decode
    } else if (state == instructionState.execute){
      if ( (instruction & lastPartMask) == read_mem ){
        lineState = lineStates.ld
      } else if ( (instruction & lastPartMask) == write_mem) {
        lineState = lineStates.st
      } else if ( (instruction & lastPartMask) == ldi) {
        lineState = lineStates.ldi
      } else if ( (instruction & lastPartMask) == jump) {
        lineState = lineStates.nop
        if ((instruction & jTypeMask) == jumpNo){
          lineState = lineStates.branching_ex
        } else if (((instruction & jTypeMask) == jumpZ) && flagNZ >= flagZ
                    || ((instruction & jTypeMask) == jumpNZ) && flagNZ != flagZ && flagNZ != flagN + flagZ
                    || ((instruction & jTypeMask) == jumpNeg) && flagNZ >= flagN
                    || ((instruction & jTypeMask) == jumpNeNeg) && flagNZ != flagN && flagNZ != flagN + flagZ){
          lineState = lineStates.branching_ex
        } else {
          lineState = lineStates.nop
        }
      }  else { //op ALU
        if ((instruction & lastPartMask) == opAdd || (instruction & lastPartMask) == opSub || 
            (instruction & lastPartMask) == opAnd || (instruction & lastPartMask) == opOr){
          lineState = lineStates.opThreeReg
        } else if ((instruction & lastPartMask) == opShr || (instruction & lastPartMask) == opShl ||
                   (instruction & lastPartMask) == opMv){
          lineState = lineStates.opTwoReg
        }
      }
    }
    lineState
  }

  def setStimulatedLines(linesToSet: Array[Int], lines: Array[String]): Array[String] = {
    val toReturn = lines;
    for(line <- linesToSet){
      toReturn(line - 1) = "true"
    }
    toReturn
  }
  /*
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
  */
}

