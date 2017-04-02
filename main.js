const {app, BrowserWindow, Menu, shell} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron')
const {dialog} = require('electron')
const {document} = require('electron')
const fs = require('fs')
const defaultMenu = require('electron-default-menu');



let win
let webContents

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))


  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})


var showOpen = function () {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) {
      console.log('No file selected')
    } else {
      readFile(fileNames[0])

      var ipc = require('electron').ipcMain
      ipc.on('invokeAction', function (event) {
        var result = readFile(fileNames[0])
        event.sender.sent('actionReply', result)
      })
    }
  })
}
function readFile (filepath) {
  fs.readFile(filepath, 'utf-8', function (err, data) {
    if (err) {
      alert('An error ocurred reading the file :' + err.message)
      return
    }
    const {ipcMain} = require('electron')

    webContents.send('asynchronous-message', data)
  })
}

const menu = defaultMenu ( app,shell)

menu.splice(0,0, {
  label: 'File',
  submenu: [
    {
      label: 'Open',
      accelerator: 'Control+O',
      click: function () { showOpen() }

    }, {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ]
})

Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
