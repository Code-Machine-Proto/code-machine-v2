package risc_v_patterson.execs

import risc_v_patterson.risc_v_patterson
import risc_v_patterson.risc_v_patterson_compiler

object risc_v_sandbox extends App {
  var program = risc_v_patterson_compiler.readProgramFromFile("./programs_files/risc_v/target_risc_v.txt")
  program = risc_v_patterson_compiler.removeEmptyLinesAndSpaces(risc_v_patterson_compiler.removeComments(program))
  val textLines = risc_v_patterson_compiler.parseTextAndData(program)(0)
  val dataLines = risc_v_patterson_compiler.parseTextAndData(program)(1)
//  System.out.println(textLines.mkString("\n"))
  System.out.println(dataLines.mkString("\n"))
  val textLabels = risc_v_patterson_compiler.mapTextLabels(textLines)
//  System.out.println(textLabels.mkString("\n"))
  val dataLabels = risc_v_patterson_compiler.mapDataLabels(dataLines)
//  System.out.println(dataLabels.mkString("\n"))
  val flattenedDataLines = risc_v_patterson_compiler.flatDataLines(dataLines)
  System.out.println(flattenedDataLines.mkString("\n"))
}