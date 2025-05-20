# Paths should be changed according to the host running the NodeJS server
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\currentProgram.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\programs"
Set-Location -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel"
sbt "test:runMain accumulator_v1_getHexcode_exec"
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\output_files\hex_program.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\output_files"