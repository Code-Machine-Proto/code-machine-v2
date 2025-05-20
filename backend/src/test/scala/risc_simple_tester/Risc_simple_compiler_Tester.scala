package risc_simple

import chisel3._
import chisel3.util._
import chisel3.iotesters._

import java.io.FileWriter

import risc_simple.compiler.asm_compiler._
object CompilerTester extends App {

/*
  val filename = "./programs_files/program_risc_1.txt";
  val print_text = compile_for_print_text(filename)
  val backend_text = compile_for_backend_text(filename)
  
  for(idx <- 0 until print_text.length) {
    println(print_text(idx).mkString(""))
  }
  for(idx <- 0 until backend_text.length) {
    println(backend_text(idx))
  }
  
  val print_data = compile_for_print_data(filename)
  val backend_data = compile_for_backend_data(filename)
  
  for(idx <- 0 until print_data.length) {
    println(print_data(idx).mkString(""))
  }
  for(idx <- 0 until backend_data.length) {
    println(backend_data(idx))
  }
  
  */

  var instructionsString = Array[String]() 
  val programFilename = "./programs_files/program_risc_1.txt";
  
  instructionsString = readProgramFromFile(programFilename);
  println("------------ Initial ASM -----------")
  for(idx <- 0 until instructionsString.length) {
    println(instructionsString(idx).mkString(""))
  }
  instructionsString = removeEmptyLinesAndSpaces(instructionsString);
  instructionsString = removeComments(instructionsString);
  instructionsString = adjustComma(instructionsString);
  
  
  // For dev. purposes  // Clean ASM
  println("------------ Clean ASM -----------")
  for(idx <- 0 until instructionsString.length) {
    println(instructionsString(idx).mkString(""))
  }
  
  // For dev. purposes // Seperate ASM
  
  val textLines = parseTextAndData(instructionsString)(0)
  val dataLines = parseTextAndData(instructionsString)(1)
  println("------------ .Text ASM -----------")
  for(idx <- 0 until textLines.length) {
    println(textLines(idx).mkString(""))
  }
  println("------------ .Data ASM -----------")
  for(idx <- 0 until dataLines.length) {
    println(dataLines(idx).mkString(""))
  }
  
  // For dev. purposes // Check Hash Map of Text&Data etiquettes (branch)
  
  val textLabelsMap = mapTextLabels(textLines)
  println("------------ .TextMap ASM -----------")
  println(textLabelsMap)
  
  val dataLabelsMap = mapDataLabels(dataLines, textLines.length - textLabelsMap.size)
  println("------------ .DataMap ASM -----------")
  println(dataLabelsMap)

  // For dev. purposes // Check conversion of Text&Data arguments into adresses & delete of etiquettes
  
  val flatenedTextLines = flatTextLines(textLines, dataLabelsMap, textLabelsMap)
  println("------------ .FlatText ASM -----------")
  for(idx <- 0 until flatenedTextLines.length) {
    println(flatenedTextLines(idx).mkString(""))
  }
  val flatenedDataLines = flatDataLines(dataLines, dataLabelsMap, textLabelsMap, textLines.length - textLabelsMap.size)
  println("------------ .FlatData ASM -----------")
  for(idx <- 0 until flatenedDataLines.length) {
    println(flatenedDataLines(idx).mkString(""))
  }
  
  // For dev. purposes // convert Text&Data to Hex
  
  val UIntText = parseStringInstructionToUInt(flatenedTextLines)
  val HexText = getHexcodeProgram(UIntText)
  println("------------ .Hex Text ASM -----------")
  for(idx <- 0 until HexText.length) {
    println(HexText(idx).mkString(""))
  }
   
  val UIntData = parseStringDataToUInt(flatenedDataLines)
  val HexData = getHexcodeProgram(UIntData)
  println("------------ .Hex Data ASM -----------")
  for(idx <- 0 until HexData.length) {
    println(HexData(idx).mkString(""))
  }


  
}
