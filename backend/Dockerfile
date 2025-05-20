FROM openjdk:8-jre-alpine

# set working directory
WORKDIR /app

RUN mkdir programs_files \ 
  && mkdir output_files \ 
  && mkdir test_run_dir


ADD Accumulator_CPU_Chisel-assembly-0.1.0.jar ./

ENTRYPOINT ["java","-jar","Accumulator_CPU_Chisel-assembly-0.1.0.jar"]