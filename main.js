'use strict'

const electron = require('electron')
const {app, BrowserWindow, Menu, shell, dialog, ipcMain} = electron
const path = require('path')
const url = require('url')
const defaultMenu = require('electron-default-menu')
const fs = require('fs')

function getAppSize () {
  let size = electron.screen.getPrimaryDisplay().workAreaSize
  let maxDimension = Math.max(size.width, size.height)

  return {
    width: maxDimension * 0.65,
    height: maxDimension * 0.4
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.on('ready', function createWindow () {
  // Create browser window
  mainWindow = new BrowserWindow(getAppSize())

  // Load index.html
  // mainWindow.loadURL('file://' + __dirname + '/app/index.html')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocal: 'file:',
    slashes: true
  }))
})

var content = ''

ipcMain.on('asynchronous-message', (event, contents) => {
  content = contents
})

function tabName (name) {
  let index
  for (var i = 0; i < name.length; i++) {
    if (name[i] === '\\') {
      index = i
    }
  }
  let title = name.substring(index + 1, name.length)
  return title
}

var newFile = function () {
  mainWindow.webContents.send('NewFileMessage', 'untitled')
}

var showOpen = function () {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) {
      console.log('No file selected')
    } else {
      let f = fileNames[0]
      if (f === undefined) return
      readFile(fileNames[0])

      var ipc = require('electron').ipcMain
      ipc.on('invokeAction', function (event) {
        var result = readFile(fileNames[0])
        event.sender.send('actionReply', result)
      })

      var tabTitle = tabName(fileNames[0])
      mainWindow.webContents.send('OpenFile', tabTitle, fileNames)
    }
  })
}
function readFile (filepath) {
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      console.log('An error ocurred reading the file :' + err.message)
    }
  })
}
var currentPath = ''

ipcMain.on('tabPath', (event, path) => {
  currentPath = path
})

var saveFile = function () {
  console.log(currentPath)
  if (currentPath === '') {
    dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) {
        console.log("You didn't save the file")
        return
      }
      fs.writeFile(fileName, content)
      let titleName = tabName(fileName)
      mainWindow.webContents.send('saveFile', titleName, fileName)
    })
  } else {
    fs.writeFile(currentPath, content)
  //  tabName(currentPath)
  }
}

var saveAsFile = function () {
  dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) {
      console.log("You didn't save the file")
      return
    }
    fs.writeFile(fileName, content)
    let tabTitle = tabName(fileName)
    mainWindow.webContents.send('saveFile', tabTitle, fileName)
  })
}

const menu = defaultMenu(app, shell)

menu.splice(0, 0, {
  label: 'File',
  submenu: [
    {
      label: 'New',
      accelerator: 'Control+N',
      click: function () { newFile() }
    },
    {
      label: 'Open',
      accelerator: 'Control+O',
      click: function () { showOpen() }
    },
    {
      label: 'Save',
      accelerator: 'Control+S',
      click: function () { saveFile() }
    },
    {
      label: 'Save As...',
      accelerator: 'Control+Alt+S',
      click: function () { saveAsFile() }
    },
    {
      label: 'Quit',
      accelerator: 'Alt+F4',
      click: () => { app.quit() }
    }
  ]
})

Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
