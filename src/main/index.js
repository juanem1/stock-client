'use strict'

import electron from 'electron'
const { app, BrowserWindow } = electron

const isDev = process.env.NODE_ENV === 'development'

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

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
