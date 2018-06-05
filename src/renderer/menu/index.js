import { Menu } from 'electron'

const template = [
  /* {
    label: 'Test',
    submenu: [
      {
        label: 'Launch a function in Renderer process',
        click: () => { mainWindow.webContents.send('hello', 'Hello World!') }
      }
    ]
  } */
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
