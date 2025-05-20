const express = require('express');
const Shell = require('node-powershell');
const app = express();
app.use(express.json());
const port = 8000;
const { exec } = require('child_process');
var http = require('http');

const ps = new Shell({
  executionPolicy: 'Bypass',
  noProfile: true
});

const execOptions = {
    cwd: null,
    env: null,
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 1024*1024,
    shell: 'powershell.exe'
}

var fs = require('fs');

function replaceCurrentProgram(body){
    fs.writeFileSync('currentProgram.txt', '', function (error) {
        if (error) {
            console.log(error);
        }
    });

    for (element of body) {
        fs.appendFileSync('currentProgram.txt', element + "\n", function (error) {
            if (error) {
                console.log(error);
            }
        });
    }
}

function executeExternalCommand(command, shell, shouldPrint){
    try {
        exec(command, { 'shell': shell}, (error, stdout, stderr) => {
            if(shouldPrint){
                console.log(stdout)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

app.get('/compileAndRun', (req, res) => {
    var options = {
        port: '8080',
        host: 'localhost',
        path: '/compileAndRun',
        body: req.body
    };

    var body = '';

    var req = http.get(options, function(getRes) {
        getRes.on('data', function(chunk) {
            body += chunk;
        })
        getRes.on('end', function() {
            console.log(body);
            res.send("ok")
        })
    });
})

app.post('/compile', (req, res) => {
    replaceCurrentProgram(req.body);
    try {
        // script.ps1 executes sbt commands and copy result files into nodejs working repository
        exec('./scripts/compile.ps1', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
            if (stdout.includes("error")) {
                res.send("Errors occured while compiling " + stdout)
            } else {
                res.send("Compilation was successful " + stdout)
            }
        })
    } catch (error) {
        console.log("ERREUR:")
        console.log(error)
    }
})

app.post('/get_hex', (req, res) => {
    var responseArray = []

    fs.writeFileSync('currentProgram.txt', '', function (error) {
        if (error) {
            console.log(error);
        }
    });

    for (element of req.body) {
        fs.appendFileSync('currentProgram.txt', element + "\n", function (error) {
            if (error) {
                console.log(error);
            }
        });
    }

    try {
        // script.ps1 executes sbt commands and copy result files into nodejs working repository
        exec('./scripts/get_hex.ps1', { 'shell': 'powershell.exe' }, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }else{
                console.log(stdout);
                try {
                    responseArray = fs.readFileSync('output_files/hex_program.txt', 'utf8').toString().split("\n");
                } catch (e) {
                    console.log('Error:', e.stack);
                }
            }
        })
    } catch (error) {
        console.log("ERREUR:")
        console.log(error)
    } finally {
        res.send(responseArray)
    }
});

app.post('/compile', (req, res) => {
    replaceCurrentProgram(req.body);
    try {
        // script.ps1 executes sbt commands and copy result files into nodejs working repository
        exec('./scripts/compile.ps1', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
            if (stdout.includes("error")) {
                res.send("Errors occured while compiling " + stdout)
            } else {
                res.send("Compilation was successful " + stdout)
            }
        })
    } catch (error) {
        console.log("ERREUR:")
        console.log(error)
    }
})



app.post('/get_hex_id/:id', (req, res) => {

    var programFileName = 'program_' + req.params.id + '.txt';
    var scriptFileName = 'get_hex_script_' + req.params.id + '.ps1';
    var responseArray = []

    fs.writeFileSync('./programs_files/' + programFileName, '', function (error) {
        if (error) {
            console.log(error);
        }
    });

    for (element of req.body) {
        fs.appendFileSync('./programs_files/' + programFileName, element + "\n", function (error) {
            if (error) {
                console.log(error);
            }
        });
    }


    fs.writeFileSync('./scripts/' + scriptFileName, "", function(error){});

    sbtCommand = 'sbt "test:runMain accumulator_v1_getHexcode_param_exec ' + req.params.id + " " + programFileName + '" | Out-Null';
    copyProgramCommand = 'Copy-Item -Path "C:/Users/Andy/Documents/CodeMachine/Backend_nodeJS/programs_files/' + programFileName + '"' + ' -Destination "C:/Users/Andy/Documents/CodeMachine/accumulator-chisel/programs_files"';
    copyResultCommand = 'Copy-Item -Path "C:/Users/Andy/Documents/CodeMachine/accumulator-chisel/output_files/hex_program_' + req.params.id + '.txt' +  '"' + ' -Destination "C:/Users/Andy/Documents/CodeMachine/Backend_nodeJS/output_files"';
    closeCommand = 'Return 0';

    var commands = ['Set-Location -Path "C:/Users/Andy/Documents/CodeMachine/accumulator-chisel"', 
    copyProgramCommand,
    sbtCommand,
    copyResultCommand,
    closeCommand]

    for (element of commands) {
        fs.appendFileSync('./scripts/' + scriptFileName, element + "\n", function (error) {});
    }

    try {
        // script.ps1 executes sbt commands and copy result files into nodejs working repository
        exec('./scripts/' + scriptFileName, execOptions, (err, stdout, stderr) => {
            if(err){
                console.log(err);
            }else{
                console.log(stdout)
                try {
                    responseArray = fs.readFileSync('output_files/hex_program_' + req.params.id + '.txt', 'utf8').toString().split("\n");
                } catch (e) {
                    console.log('Error:', e.stack);
                }
            }
            console.log("Fin de get_hex_id.")
            res.send(responseArray)
        })
    } catch (error) {
        console.log("ERREUR:")
        console.log(error)
    }


});

// ID du processeur pour la compilation à ajouter
app.post('/run_simulation', (req, res) => {

    console.log(req.body)

    fs.writeFileSync('currentProgram.txt', '', function(error){
        if(error){
            console.log(error);
        }
    });

    for(element of req.body){
        fs.appendFileSync('currentProgram.txt', element + "\n", function(error){
            if(error){
                console.log(error);
            }
        });
    }

    var responseArray = []

    try {
        // script.ps1 executes sbt commands and copy result files into nodejs working repository
        exec('./scripts/run_simulation.ps1', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
            if (stdout.includes("error")) {
                console.log("ERREUR")
            } else {
                console.log("SUCCES")
                try {
                    responseArray[0] = fs.readFileSync('output_files/acc_status.txt', 'utf8').toString().split("\n");
                    responseArray[1] = fs.readFileSync('output_files/internal_memory_status.txt', 'utf8').toString().split("\n");
                    responseArray[2] = fs.readFileSync('output_files/ir_status.txt', 'utf8').toString().split("\n");
                    responseArray[3] = fs.readFileSync('output_files/pc_status.txt', 'utf8').toString().split("\n");
                    responseArray[4] = fs.readFileSync('output_files/state_status.txt', 'utf8').toString().split("\n");
                } catch (e) {
                    console.log('Error:', e.stack);
                }
            }
            res.send(responseArray)
        })
    } catch (error) {
        console.log(error)
        res.send("ERREUR")
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
});

