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
  const win = new BrowserWindow({
    // change opening size to something like 800×600
    width: 500,
    height: 600,
    // enforce minimum dimensions if desired
    minWidth: 500,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden', // <-- optional on macOS for a cleaner look
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
  win.once('ready-to-show', () => win.show())

  win.removeMenu()      // strip out the default menu bar
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})