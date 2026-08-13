import { app, BrowserWindow, dialog } from "electron";
import { ChildProcess, spawn } from "node:child_process";
import isDev from "electron-is-dev";
import path from "node:path";
import http from "node:http";

function waitForServer(port: number, timeout = 30_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeout;
    const probe = () => {
      http
        .get(`http://localhost:${port}`, () => resolve())
        .on("error", () => {
          if (Date.now() >= deadline) {
            reject(new Error(`Server on port ${port} did not start within ${timeout}ms`));
          } else {
            setTimeout(probe, 200);
          }
        });
    };
    probe();
  });
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    ...(process.platform !== "darwin"
      ? {
          titleBarOverlay: {
            color: "#0e1d31",
            symbolColor: "#ffffff",
          },
        }
      : {}),
    webPreferences: {
      devTools: isDev,
    },
  });

  mainWindow.loadFile("./build/client/index.html");
}

let scalaServer: ChildProcess;

app.whenReady().then(async () => {
  const execPath = isDev
    ? "./module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar"
    : path.join(process.resourcesPath, "module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar");

  const stderrLines: string[] = [];

  scalaServer = spawn("java", ["-jar", execPath], {
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  scalaServer.stdout?.on("data", (d: Buffer) => stderrLines.push(`[stdout] ${d.toString()}`));
  scalaServer.stderr?.on("data", (d: Buffer) => stderrLines.push(`[stderr] ${d.toString()}`));
  scalaServer.on("error", (err) => stderrLines.push(`[spawn error] ${err.message}`));
  scalaServer.on("exit", (code, signal) => stderrLines.push(`[exit] code=${code} signal=${signal}`));

  try {
    await waitForServer(8080, 60_000);
  } catch (err) {
    await dialog.showMessageBox({
      type: "error",
      title: "Backend failed to start",
      message: (err as Error).message,
      detail: stderrLines.join("") || "(no output)",
    });
    app.quit();
    return;
  }

  scalaServer.stdout?.removeAllListeners("data");
  scalaServer.stderr?.removeAllListeners("data");
  createWindow();
});

app.on("before-quit", () => {
  if (scalaServer) scalaServer.kill();
});
