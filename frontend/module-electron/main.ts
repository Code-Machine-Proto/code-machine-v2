import { app, BrowserWindow } from "electron";
import { ChildProcess, spawn } from "node:child_process";
import isDev from "electron-is-dev";
import path from "node:path";

/**
 * Fonction pour créer et afficher la fenêtre principale
 */
function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        ...(process.platform !== 'darwin' ? { titleBarOverlay: {
            color: "#0e1d31",
            symbolColor: "#ffffff",
        } } : {}),
        webPreferences: {
            devTools: isDev,
        },
    });

    mainWindow.loadFile("./build/client/index.html");
}

/**
 * Variable pour pouvoir accéder au serveur scala
 */
let scalaServer : ChildProcess;

/**
 * Script déclenché lorsque l'application est prête, lance le serveur et créer la fenêtre
 */
app.whenReady().then(() => {
    const execPath = isDev ? "./module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar" : path.join(process.resourcesPath, "module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar");
    scalaServer = spawn("java", ["-jar", execPath], { windowsHide: true });

    createWindow();
});

/**
 * Quitter le serveur scala lorsque l'application se ferme
 */
app.on('before-quit',() => {
    if(scalaServer) {
        scalaServer.kill();
    }
});
