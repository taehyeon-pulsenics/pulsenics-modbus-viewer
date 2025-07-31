import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow = null
let tray = null
let isQuitting = false

const lock = app.requestSingleInstanceLock()

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  // Minimize to tray on close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // HMR for renderer in development
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Build application menu
  const isMac = process.platform === 'darwin'
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Check for Update',
          click: () => {
            // checkForUpdates();
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            isQuitting = true
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
              }
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://electronjs.org')
        },
        { type: 'separator' },
        {
          label: 'App Version',
          sublabel: app.getVersion()
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createTray() {
  const trayIcon =
    process.platform === 'win32'
      ? join(__dirname, '../../public/logo.ico')
      : join(__dirname, '../../public/icon.png')

  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainWindow.show()
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Pulsenics Modbus Viewer')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => mainWindow.show())
}

if (!lock) {
  isQuitting = true
  app.quit()
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return

    // 1) If the window was minimized, restore it
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    // 2) If the window was hidden (not visible), show it
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }

    // 3) Finally, bring it to front/focus
    mainWindow.focus()

    // (Optional Windows hack if focus still fails:
    // mainWindow.setAlwaysOnTop(true)
    // mainWindow.setAlwaysOnTop(false)
    // )
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.pulsenics.modbusviewer')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    ipcMain.on('ping', () => console.log('pong'))

    createWindow()
    createTray()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
      else mainWindow.show()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      isQuitting = true
      app.quit()
    }
  })
}
