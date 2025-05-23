const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

// Disable any Chromium command-line flags for DevTools early
app.commandLine.appendSwitch('disable-features', 'DevTools')

app.on('web-contents-created', (e, contents) => {
  // block Ctrl+Shift+I / Cmd+Option+I
  contents.on('before-input-event', (event, input) => {
    if ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault()
    }
  })
})

// File path for saving the notepad content
const filePath = path.join(app.getPath('userData'), 'notepadContent.txt')

// IPC handler to read the file
ipcMain.handle('read-file', async () => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    }
    return ''
  } catch (error) {
    console.error('Error reading file:', error)
    return ''
  }
})

// Optimize the save operation with throttling
let saveTimeout = null
ipcMain.on('save-file', (event, content) => {
  // Clear any pending saves
  if (saveTimeout) clearTimeout(saveTimeout)
  
  // Debounce save operations to reduce disk I/O
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8')
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }, 500) // Wait 500ms before saving
})

function createWindow() {
  const isWindows = process.platform === 'win32'
  const win = new BrowserWindow({
    width: isWindows ? 400 : 500,
    height: isWindows ? 500 : 600,
    minWidth: isWindows ? 400 : 500,
    minHeight: isWindows ? 500 : 600,
    show: false,
    frame: false, // Always frameless
    titleBarStyle: 'hidden', // Hide native title bar, show overlay
    titleBarOverlay: {
      color: 'rgba(0,0,0,0)',   // Fully transparent background for the overlay
      symbolColor: '#ffffff88'        // (Optional) Color for the button icons
    },
    icon: path.join(
      __dirname,
      process.platform === 'darwin' ? 'rounded_icon.icns' : 'rounded_icon.ico'
    ),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,    // completely disable DevTools
      backgroundThrottling: true,  // Enable throttling when app is in background
      enableWebSQL: false,          // Disable WebSQL
      spellcheck: false,            // Disable spellcheck if not needed
      offscreen: false              // Ensure not using offscreen rendering
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))
  win.once('ready-to-show', () => {
    // Set zoom to 90% on Windows
    if (process.platform === 'win32') {
      win.webContents.setZoomFactor(0.8)
    }
    win.show()
  })

  win.removeMenu()      // strip out the default menu bar

  // Add these event listeners to reduce CPU usage when window is not focused
  win.on('blur', () => {
    // Reduce update frequency when app loses focus
    win.webContents.setFrameRate(10) // Lower framerate when unfocused
  })

  win.on('focus', () => {
    // Restore normal update frequency when app gains focus
    win.webContents.setFrameRate(60) // Normal framerate when focused
  })
}

// Add this to reduce IPC overhead
app.allowRendererProcessReuse = true;

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})