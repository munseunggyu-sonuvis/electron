import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
    on: (
      channel: string,
      listener: (event: unknown, ...args: unknown[]) => void
    ) => ipcRenderer.on(channel, listener),
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  // Todo 관련 API
  getTodos: () => ipcRenderer.invoke("get-todos"),
  createTodo: (text: string) => ipcRenderer.invoke("create-todo", text),
  deleteTodo: (id: number) => ipcRenderer.invoke("delete-todo", id),
});
