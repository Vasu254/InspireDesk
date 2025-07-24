const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const { updateWallpaper } = require("./utils/wallpaper-generator-new");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: true,
    titleBarStyle: "default",
  });

  mainWindow.loadFile("renderer/index.html");

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Simple minimize behavior
  mainWindow.on("minimize", () => {
    // Just minimize normally, no tray
    console.log("Window minimized");
  });
}

function showNotification(title, body) {
  if (Notification.isSupported()) {
    try {
      new Notification({
        title: title,
        body: body,
        silent: false,
      }).show();
    } catch (error) {
      console.log("Notification not shown:", error.message);
    }
  }
}

// Handle wallpaper update
ipcMain.handle("update-wallpaper", async (event, goals, settings) => {
  if (!goals || !Array.isArray(goals) || goals.length === 0) {
    return { success: false, error: "Invalid goals data" };
  }
  try {
    console.log("Updating wallpaper with goals:", goals);
    console.log("Settings:", settings);

    await updateWallpaper(goals, settings);
    showNotification(
      "Success!",
      `Wallpaper updated with ${goals.length} goals`
    );
    return { success: true };
  } catch (error) {
    console.error("Error updating wallpaper:", error);
    showNotification("Error", "Failed to update wallpaper: " + error.message);
    return { success: false, error: error.message };
  }
});

// Handle other IPC calls
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("show-notification", (event, title, body) => {
  showNotification(title, body);
});

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
