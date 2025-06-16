import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain } from "electron";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server";
import { join } from "path";
import { todoModel } from "./db/todoModel";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30011, 50000] });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: "localhost",
      port: nextJSPort,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

// IPC 핸들러 설정
ipcMain.handle("get-todos", async () => {
  try {
    const todos = todoModel.getAll();
    return { error: false, data: todos };
  } catch (error) {
    console.error("Error fetching todos:", error);
    return { error: true, data: [] };
  }
});

ipcMain.handle("create-todo", async (_, text: string) => {
  try {
    const todo = todoModel.create(text);
    return { error: false, data: todo };
  } catch (error) {
    console.error("Error creating todo:", error);
    return { error: true, data: null };
  }
});

ipcMain.handle("delete-todo", async (_, id: number) => {
  try {
    todoModel.delete(id);
    return { error: false, data: null };
  } catch (error) {
    console.error("Error deleting todo:", error);
    return { error: true, data: null };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
