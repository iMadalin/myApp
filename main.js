const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron')
const {dialog} = require('electron')
const {document} = require('electron')
const fs = require('fs')

const React = require('react')
const ReactDOM = require('react-dom')



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

  webContents = win.webContents

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

const Menu = electron.Menu

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
    /*
    ipcMain.on('asynchronous-message', (event, arg) => {
      event.sender.send('asynchronous-message',data)
    })
    */
    webContents.send('asynchronous-message', data)
    console.log('The file content is : ' + data)
  })
}

const menuTemplate = [
  {
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
  }
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
