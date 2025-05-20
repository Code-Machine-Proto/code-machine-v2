package risc_v_patterson

import scala.io.Source
import util.control.Breaks._
import scala.math.BigInt

object risc_v_patterson_compiler {

  val dataTypes = risc_v_patterson.commons.dataTypes

  def readProgramFromFile(filename: String): Array[String] = {
    var toReturn = Array[String]()
    for(line <- Source.fromFile(filename).getLines){
      toReturn = toReturn :+ line
    }
    toReturn
  }

  def removeComments(programLines: Array[String]): Array[String] = {
    var toReturn = Array[String]()
    for(line <- programLines){
      if(line.contains("#")){
        toReturn = toReturn :+ line.split('#')(0)
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
      if(dataEncountered && !textEncountered && line != ".data")
        dataLines = dataLines :+ line
      if(textEncountered && line != ".text")
        textLines = textLines :+ line
    }
    toReturn = (toReturn :+ textLines) :+ dataLines
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

  // Dimensions of the data ? Int -> 4, Bytes -> 1 etc...
  def mapDataLabels(dataLines: Array[String]): scala.collection.mutable.HashMap[String, Int] = {
    val toReturn = new scala.collection.mutable.HashMap[String, Int]()
    var nbValues = 0

    for(line <- dataLines){
      breakable {
        if(line.contains(":")) {
          val dataLabel = line.split(":")(0)
          toReturn.put(dataLabel, nbValues)
          break
        }
      }
      if(line.contains(",")){
        val dataType = line.split(",")(0).split(" ")(0).trim().replace(".", "")
        nbValues = nbValues + (line.split(",").length * dataTypes(dataType))
      }else if(line.contains(".")){
        val dataType = line.split(",")(0).split(" ")(0).trim().replace(".", "")
        nbValues = nbValues + dataTypes(dataType)
      }
    }
    toReturn
  }

  def flatDataLines(dataLines: Array[String]): Array[Byte] = {
    var toReturn = Array[Byte]()

    for(line <- dataLines){
      if(line.contains(".")){
        val newLine = line.trim().replaceAll(",", "")
        val arrayOfValues = newLine.split(" ")

        val dataType = newLine.split(",")(0).split(" ")(0).trim().replace(".", "")

        for(value <- arrayOfValues){
          if(isAllDigits(value)){
            val byteArray = BigInt(value.toInt).toByteArray
            // Byte array size should be <= 4
            for(byte <- byteArray){
              toReturn = toReturn :+ byte
            }
          }
        }
      }
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
}
