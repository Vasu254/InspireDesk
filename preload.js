const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  updateWallpaper: (goals, settings) =>
    ipcRenderer.invoke("update-wallpaper", goals, settings),
  showNotification: (title, body) =>
    ipcRenderer.invoke("show-notification", title, body),
});
