'use strict'

import electron from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

const { app, BrowserWindow, ipcMain } = electron
const isDev = process.env.NODE_ENV === 'development'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (!isDev) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = isDev ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow () {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: height,
    useContentSize: true,
    width: width,
    webPreferences: {
      webSecurity: !isDev
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * function createMenu () {
  if (isDev) {
    mainMenu.push(devMenu)
  }
  NativeMenu.setApplicationMenu(
    NativeMenu.buildFromTemplate(mainMenu)
  )
}
*/

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('checking-for-update')
})
autoUpdater.on('update-available', info => {
  mainWindow.webContents.send('update-available', info)
})
autoUpdater.on('update-not-available', info => {
  mainWindow.webContents.send('update-not-available', info)
})
autoUpdater.on('error', error => {
  mainWindow.webContents.send('error', error)
})
autoUpdater.on('download-progress', progress => {
  mainWindow.webContents.send('download-progress', progress)
})
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})

// Only check for updates
ipcMain.on('checkForUpdates', (event, arg) => {
  if (!isDev) autoUpdater.checkForUpdates()
})

// Check for updates and notify
ipcMain.on('checkForUpdatesAndNotify', (event, arg) => {
  if (!isDev) autoUpdater.checkForUpdatesAndNotify()
})

// Manually download one update
ipcMain.on('downloadUpdates', (event, arg) => {
  autoUpdater.downloadUpdate()
})

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on('quitAndInstall', (event, arg) => {
  autoUpdater.quitAndInstall()
})
