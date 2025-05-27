const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("os");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Request single instance lock - add this near the top
const gotTheLock = app.requestSingleInstanceLock();

// If we couldn't get the lock, quit the app
if (!gotTheLock) {
  app.quit();
} else {
  // If we got the lock, register a handler for second-instance events
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    if (BrowserWindow.getAllWindows().length) {
      const mainWindow = BrowserWindow.getAllWindows()[0];
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Continue with the rest of your app initialization
  // Disable any Chromium command-line flags for DevTools early
  app.commandLine.appendSwitch("disable-features", "DevTools");

  app.on("web-contents-created", (e, contents) => {
    // block Ctrl+Shift+I / Cmd+Option+I
    contents.on("before-input-event", (event, input) => {
      if (
        (input.control || input.meta) &&
        input.shift &&
        input.key.toLowerCase() === "i"
      ) {
        event.preventDefault();
      }
    });
  });

  // File path for saving the notepad content
  const filePath = path.join(app.getPath("userData"), "notepadContent.txt");

  // IPC handler to read the file
  ipcMain.handle("read-file", async () => {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8");
      }
      return "";
    } catch (error) {
      console.error("Error reading file:", error);
      return "";
    }
  });

  // Optimize the save operation with throttling
  let saveTimeout = null;
  ipcMain.on("save-file", (event, content) => {
    // Clear any pending saves
    if (saveTimeout) clearTimeout(saveTimeout);

    // Debounce save operations to reduce disk I/O
    saveTimeout = setTimeout(() => {
      try {
        fs.writeFileSync(filePath, content, "utf-8");
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }, 500); // Wait 500ms before saving
  });

  //For music playback status on macOS

  ipcMain.handle("getNowPlaying", async () => {
    if (os.platform() === "darwin") {
      return new Promise((resolve) => {
        const script = `
          tell application "System Events"
            set processList to (name of every process)
          end tell

          if processList contains "Music" then
            tell application "Music"
              if player state is playing then
                set trackName to name of current track
                set artistName to artist of current track
                return trackName & ";;;" & artistName
              else
                return ";;;"
              end if
            end tell
          else
            return ";;;"
          end if
        `;
        exec(`osascript -e '${script}'`, (error, stdout) => {
          if (!error && stdout) {
            const [title, artist] = stdout.trim().split(";;;");
            resolve({
              title: title || null,
              artist: artist || null,
            });
          } else {
            resolve({ title: null, artist: null });
          }
        });
      });
    }
    return { title: null, artist: null };
  });

  //End of code for music playback status on macOS

  function createWindow() {
    const isWindows = process.platform === "win32";
    const win = new BrowserWindow({
      width: isWindows ? 400 : 500,
      height: isWindows ? 500 : 600,
      minWidth: isWindows ? 400 : 500,
      minHeight: isWindows ? 500 : 600,
      show: false,
      frame: false, // Always frameless
      titleBarStyle: "hidden", // Hide native title bar, show overlay
      titleBarOverlay: {
        color: "rgba(0,0,0,0)", // Fully transparent background for the overlay
        symbolColor: "#ffffff88", // (Optional) Color for the button icons
      },
      icon: path.join(
        __dirname,
        process.platform === "darwin" ? "Shimmer.icns" : "Shimmer.ico"
      ),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: false, // completely disable DevTools
        backgroundThrottling: true, // Enable throttling when app is in background
        enableWebSQL: false, // Disable WebSQL
        spellcheck: false, // Disable spellcheck if not needed
        offscreen: false, // Ensure not using offscreen rendering
      },
    });

    win.loadFile(path.join(__dirname, "index.html"));
    win.once("ready-to-show", () => {
      // Set zoom to 90% on Windows
      if (process.platform === "win32") {
        win.webContents.setZoomFactor(0.8);
      }
      win.show();
    });

    win.removeMenu(); // strip out the default menu bar

    // Add these event listeners to reduce CPU usage when window is not focused
    win.on("blur", () => {
      // Reduce update frequency when app loses focus
      win.webContents.setFrameRate(10); // Lower framerate when unfocused
    });

    win.on("focus", () => {
      // Restore normal update frequency when app gains focus
      win.webContents.setFrameRate(60); // Normal framerate when focused
    });
  }

  // Add this to reduce IPC overhead
  app.allowRendererProcessReuse = true;

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
