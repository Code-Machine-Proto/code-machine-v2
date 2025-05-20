package risc_v_patterson

import scala.io.Source

object risc_v_patterson_utils {

  def readMemoryFromFile(memoryFilename: String): Array[Int] ={
    var toReturn = Array[Int]()
    for(i <- 0 to 256){
      toReturn = toReturn :+ 0
    }
    toReturn
  }

  // Should check if memory.length <= max memory size (~256)
  def readMemoryFromArray(memory: Array[Int]): Array[Int] ={
    var toReturn = Array[Int]()
    for(i <- 0 to 256){
      toReturn = toReturn :+ 0
    }
    for(i <- 0 until memory.length)
      toReturn(i) = memory(i)
    toReturn
  }

  def readProgramFromFile(programeFilename: String): Array[Int] = {
    var toReturn = Array[Int]()
    for(i <- 0 to 256){
      toReturn = toReturn :+ 0
    }
    var lineIdx = 0
    for(line <- Source.fromFile(programeFilename).getLines){
      toReturn(lineIdx) = Integer.parseInt(line, 16)
      lineIdx = lineIdx + 1
    }
    toReturn
  }
}
