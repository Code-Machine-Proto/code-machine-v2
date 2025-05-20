Set-Location -Path "C:/Users/Andy/Documents/CodeMachine/accumulator-chisel"
Copy-Item -Path "C:/Users/Andy/Documents/CodeMachine/Backend_nodeJS/programs_files/program_1807.txt" -Destination "C:/Users/Andy/Documents/CodeMachine/accumulator-chisel/programs_files"
sbt "test:runMain accumulator_v1_getHexcode_param_exec 1807 program_1807.txt" | Out-Null
Copy-Item -Path "C:/Users/Andy/Documents/CodeMachine/accumulator-chisel/output_files/hex_program_1807.txt" -Destination "C:/Users/Andy/Documents/CodeMachine/Backend_nodeJS/output_files"
Return 0
