import { app, BrowserWindow } from "electron";
import { ChildProcess, spawn } from "node:child_process";
import isDev from "electron-is-dev";
import path from "node:path";

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });

    mainWindow.loadFile("./build/client/index.html");
}

let scalaServer : ChildProcess;

app.whenReady().then(() => {
    const execPath = isDev ? "./module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar" : path.join(process.resourcesPath, "module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar");
    scalaServer = spawn("java", ["-jar", execPath], { windowsHide: true });

    createWindow();
});

app.on('before-quit',() => {
    if(scalaServer) {
        scalaServer.kill();
    }
});
