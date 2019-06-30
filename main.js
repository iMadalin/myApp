'use strict'

const electron = require('electron')
const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = electron
const path = require('path')
const url = require('url')
const defaultMenu = require('electron-default-menu')
const fs = require('fs')
const storage = require('./storage')
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');


installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
  console.log(`Added Extension:  ${name}`);
})
  .catch((err) => {
    console.log('An error occurred: ', err);
  });

let mainWindow
let findWindow
let startWindow
let settingWindow
let showWindow = storage.get('showStartWindow')

app.on('ready', function createWindow() {
  let size = electron.screen.getPrimaryDisplay().workAreaSize
  let lastWindowState = storage.get('lastWindowState')
  if (lastWindowState === null) {
    lastWindowState = {
      width: Math.max(size.width, size.height) * 0.65,
      height: Math.max(size.width, size.height) * 0.4,
      maximized: false
    }
  }
  mainWindow = new BrowserWindow({
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    content: lastWindowState.content,
    minWidth: 800,
    minHeight: 400,
    darkTheme: true,
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/index.html'),
    protocal: 'file:',
    slashes: true
  }))

  startWindow = new BrowserWindow({
    parent: mainWindow,
    width: 800,
    height: 200,
    show: showWindow,
    frame: false,
    resize: true,
    center: true,
    minWidth: 800,
    minHeight: 200,
    maxWidth: 800,
    maxHeight: 200,
    backgroundColor: '#373a47',
  })
  startWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/start.html'),
    protocal: 'file:',
    slashes: true,
  }))

  findWindow = new BrowserWindow({
    x: lastWindowState.x + 1500,
    y: lastWindowState.y + 150,
    width: 400,
    height: 130,
    show: false,
    frame: false,
    parent: mainWindow,
    resize: false,
    transparent: true,
  })
  findWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/find.html'),
    protocal: 'file:',
    slashes: true
  }))

  settingWindow = new BrowserWindow({
    center: true,
    resize: false,
    transparent: true,
    minWidth: 800,
    minHeight: 700,
    maxWidth: 800,
    maxHeight: 700,
    show: false,
    frame: false,
    parent: mainWindow,

  })
  settingWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/setting.html'),
    protocal: 'file:',
    slashes: true
  }))
  settingWindow.setResizable(false)

  if (lastWindowState.maximized) {
    mainWindow.maximize()
  }
  mainWindow.on('close', function () {
    let bounds = mainWindow.getBounds()

    storage.set('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      maximized: mainWindow.isMaximized(),
      content: session
    })
  })
})
let session = []
let content = ''

ipcMain.on('asynchronous-message', (ev, contents) => {
  content = contents
})

function tabName(name) {
  let index
  for (let i = 0; i < name.length; i++) {
    if (name[i] === '\\') {
      index = i
    }
  }
  let title = name.substring(index + 1, name.length)
  return title
}

let newFile = function () {
  mainWindow.webContents.send('NewFileMessage', 'untitled')
}

let showOpen = function () {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) {
      console.log('No file selected')
    } else {
      let f = fileNames[0]
      if (f === undefined) return
      readFile(fileNames[0])
      let ipc = require('electron').ipcMain
      ipc.on('invokeAction', function (event) {
        let result = readFile(fileNames[0])
        event.sender.send('actionReply', result)
      })
      let tabTitle = tabName(fileNames[0])
      mainWindow.webContents.send('OpenFile', tabTitle, fileNames)
      mainWindow.webContents.send('currentPath', path)
    }
  })
}

function readFile(filepath) {
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      console.log('An error ocurred reading the file :' + err.message)
    }
  })
}

let currentPath = ''

ipcMain.on('tabPath', (event, path) => {
  currentPath = path
  mainWindow.webContents.send('currentPath', path)
})

ipcMain.on('startPageOkButton', (ev, workDir, refUnit, showWindow) => {
  mainWindow.webContents.send('WorkDirAndRefUnitPath', workDir, refUnit)
  storage.set('showStartWindow', !(showWindow) )
  startWindow.hide()
})

ipcMain.on('startPageCloseButton', (ev) => {
  startWindow.hide()
})

ipcMain.on('brosweWorkDirButtonClicked', (ev, isFromStartWindow) => {
  const selectedPath = dialog.showOpenDialog({
    properties: ['openDirectory']

  })
  if (isFromStartWindow) {
    startWindow.webContents.send('selectedWorkDirPath', selectedPath)
  } else {
    settingWindow.webContents.send('selectedWorkDirPathFromMain', selectedPath)
  }
})

ipcMain.on('brosweRefUnitButtonClicked', (ev, isFromStartWindow) => {
  const selectedPath = dialog.showOpenDialog({
    properties: ['openDirectory']

  })
  if (isFromStartWindow) {
    startWindow.webContents.send('selectedRefUnitPath', selectedPath)
  } else {
    settingWindow.webContents.send('selectedRefUnitPathFromMain', selectedPath)
  }
})


let saveFile = function () {
  if (currentPath === '') {
    dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined) {
        console.log("You didn't save the file")
        return
      }
      fs.writeFileSync(fileName, content)
      let titleName = tabName(fileName)
      mainWindow.webContents.send('saveFile', titleName, fileName)
    })
  } else {
    fs.writeFileSync(currentPath, content)
  }
}

let saveAsFile = function () {
  dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) {
      console.log("You didn't save the file")
      return
    }
    fs.writeFileSync(fileName, content)
    let tabTitle = tabName(fileName)
    mainWindow.webContents.send('saveFile', tabTitle, fileName)
  })
}

let previousString = ''
let activeMatchOrdinal = 1
let resultMatches
ipcMain.on('findString', (event, str) => {
  activeMatchOrdinal = 1
  if (str === '') {

  } else {
    previousString = str
    mainWindow.webContents.findInPage(str)
    mainWindow.webContents.on('found-in-page', (event, result) => {
      resultMatches = result.matches
      if (result.activeMatchOrdinal) {
        this.active = activeMatchOrdinal
      }
      if (result.finalUpdate) {
        this.result_string = `${this.active} of ${result.matches}`
        findWindow.webContents.send('resultMatches', this.result_string)
      }
    })
  }
})

ipcMain.on('replaceString', (event, str) => {
  ipcMain.on('replace', (event, r) => {
    mainWindow.webContents.replace(str)
  })
})

ipcMain.on('findNext', (event, str) => {
  mainWindow.webContents.findInPage(previousString, { findNext: true }, { wordStart: true })
  if (activeMatchOrdinal === resultMatches) {
    activeMatchOrdinal = 1
  } else {
    activeMatchOrdinal += 1
  }
})

ipcMain.on('stopFind', (event, str) => {
  mainWindow.webContents.stopFindInPage('clearSelection')
  event.preventDefault();
  findWindow.hide()
})

let find = function () {
  findWindow.show()
}

let showStartWindow = function() {
  storage.set('showStartWindow', true )
}

let Insert = function (path) {
  mainWindow.webContents.send('insertElement', content, path)
}

ipcMain.on('openSetting', (event) => {
  settingWindow.show()
})

ipcMain.on('settingPageOkButton', (event, background, textColor, fontSize,
  mode, theme, basicAutocomplete, liveAutocomplete, gutter, printMargin,
  activeLine, snippets, lineNumber, softTabs, workDir, refUnit) => {
  mainWindow.setBackgroundColor(background)
  mainWindow.webContents.send('appSettings', background, textColor, fontSize,
   mode, theme, basicAutocomplete, liveAutocomplete, gutter, printMargin,
   activeLine, snippets, lineNumber, softTabs)
  mainWindow.webContents.send('WorkDirAndRefUnitPath', workDir, refUnit)
  event.preventDefault();
  settingWindow.hide()
})

ipcMain.on('settingPageCloseButton', (event) => {
  event.preventDefault();
  settingWindow.hide()
})

ipcMain.on('NavIsColse', (event) => {
  mainWindow.webContents.send('putIcon', '')
})

ipcMain.on('NavIsOpen', (event) => {
  mainWindow.webContents.send('putString', '')
})

ipcMain.on('insertNewElement', (event, path) => {
  event.preventDefault();
  mainWindow.webContents.send('insertElement', content, path)
})


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
      label: 'Find',
      accelerator: 'Control+F',
      click: function () { find() }
    },
    {
      label: 'Show start window after restart',
      type: 'checkbox',
      checked: false,
      click: function () { showStartWindow() }
    },
    {
      label: 'Quit',
      accelerator: 'Alt+F4',
      click: () => { app.quit() }
    }
  ]
})

Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
