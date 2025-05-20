# Paths should be changed according to the host running the NodeJS server
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\currentProgram.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\programs"
Set-Location -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel"
sbt "test:runMain accumulator_v1_compileAndRun_exec"
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\output_files\acc_status.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\output_files"
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\output_files\internal_memory_status.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\output_files"
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\output_files\ir_status.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\output_files"
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\output_files\pc_status.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\output_files"
Copy-Item -Path "C:\Users\Andy\Documents\CodeMachine\accumulator-chisel\output_files\state_status.txt" -Destination "C:\Users\Andy\Documents\CodeMachine\Backend_nodeJS\output_files"