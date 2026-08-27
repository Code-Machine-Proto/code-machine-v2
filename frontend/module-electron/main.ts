import { app, BrowserWindow, dialog } from 'electron';
import { ChildProcess, spawn } from 'node:child_process';
import isDev from 'electron-is-dev';
import path from 'node:path';
import http from 'node:http';
import { randomUUID } from 'node:crypto';

const SERVER_PORT: number = 8080;
const SERVER_TIMEOUT_DEFAULT: number = 60000;
const PROBE_DELAY: number = 200;

// Generated fresh per launch and passed to the Java process. The healthcheck
// below only considers the server "ready" once /health echoes this exact id,
// so a stale/zombie Java process still bound to the port (e.g. after a crash
// or a forced kill that skipped before-quit) can't be mistaken for our own.
function waitForServer(
  sessionId: string,
  port: number,
  timeout = SERVER_TIMEOUT_DEFAULT,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeout;
    const probe = () => {
      const req = http.get(`http://localhost:${port}/health`, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString());
            if (body.sessionId === sessionId) {
              resolve();
              return;
            }
          } catch {
            // fall through to retry below
          }
          retry();
        });
      });
      req.on('error', retry);

      function retry() {
        if (Date.now() >= deadline) {
          reject(
            new Error(
              `Server on port ${port} did not start within ${timeout}ms`,
            ),
          );
        } else {
          setTimeout(probe, PROBE_DELAY);
        }
      }
    };
    probe();
  });
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin'
      ? {
          titleBarOverlay: {
            color: '#0e1d31',
            symbolColor: '#ffffff',
          },
        }
      : {}),
    webPreferences: {
      devTools: isDev,
    },
  });

  mainWindow.loadFile('./build/client/index.html');
}

let scalaServer: ChildProcess;

app.whenReady().then(async () => {
  const execPath = isDev
    ? './module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar'
    : path.join(
        process.resourcesPath,
        'module-electron/Accumulator_CPU_Chisel-assembly-0.1.0.jar',
      );

  const stderrLines: string[] = [];
  const sessionId = randomUUID();

  scalaServer = spawn('java', ['-jar', execPath], {
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, CODEMACHINE_SESSION_ID: sessionId },
  });

  scalaServer.stdout?.on('data', (d: Buffer) =>
    stderrLines.push(`[stdout] ${d.toString()}`),
  );
  scalaServer.stderr?.on('data', (d: Buffer) =>
    stderrLines.push(`[stderr] ${d.toString()}`),
  );
  scalaServer.on('error', (err) =>
    stderrLines.push(`[spawn error] ${err.message}`),
  );
  scalaServer.on('exit', (code, signal) =>
    stderrLines.push(`[exit] code=${code} signal=${signal}`),
  );

  try {
    await waitForServer(sessionId, SERVER_PORT);
  } catch (err) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Backend failed to start',
      message: (err as Error).message,
      detail: stderrLines.join('') || '(no output)',
    });
    app.quit();
    return;
  }

  scalaServer.stdout?.removeAllListeners('data');
  scalaServer.stderr?.removeAllListeners('data');
  createWindow();
});

app.on('before-quit', () => {
  if (scalaServer) {
    scalaServer.kill();
  }
});
