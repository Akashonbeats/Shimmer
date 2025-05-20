const { app, BrowserWindow } = require('electron')
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
      devTools: false    // completely disable DevTools
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
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})