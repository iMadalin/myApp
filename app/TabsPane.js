import React from 'react'
import Tabs, { TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import brace from 'brace';
import localStorage from 'localStorage'
import { AwesomeButton } from 'react-awesome-button'
import 'react-awesome-button/src/styles/themes/theme-c137'
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/markdown';
import 'brace/mode/mysql';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/mode/handlebars';
import 'brace/mode/golang';
import 'brace/mode/csharp';
import 'brace/mode/coffee';
import 'brace/mode/css';
import 'brace/mode/c_cpp';
import 'brace/mode/haskell';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/textmate';
import 'brace/theme/terminal';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/dracula';
import 'brace/ext/language_tools';
import 'brace/snippets/xml';
import 'brace/snippets/javascript';
import 'brace/snippets/java';
import 'brace/snippets/python';
import 'brace/snippets/ruby';
import 'brace/snippets/markdown';
import 'brace/snippets/mysql';
import 'brace/snippets/json';
import 'brace/snippets/html';
import 'brace/snippets/handlebars';
import 'brace/snippets/golang';
import 'brace/snippets/csharp';
import 'brace/snippets/coffee';
import 'brace/snippets/css';
import 'brace/snippets/c_cpp';
import 'brace/snippets/haskell';
import 'brace/index';
import {
  CloseButton,
  PlusButton,
} from 'react-svg-buttons'
import ReactTooltip from 'react-tooltip'

function TabData(title, path, key = undefined, content = '') {
  this.tabKey = key || 'tab_' + Date.now()
  this.tabTitle = title || 'untitled'
  this.filePath = path || ''
  this.content = content
  this.oldContent = 0
}

export default class TabsPane extends React.Component {
  constructor(props) {
    super(props)
    let tab = new TabData()
    this.state = {
      tabs: JSON.parse(localStorage.getItem('tab')),
      activeKey: JSON.parse(localStorage.getItem('activeKey')),
      backgroundColor: JSON.parse(localStorage.getItem('appBackgroundColor')),
      textColor: JSON.parse(localStorage.getItem('appTextColor')),
      fondSize: JSON.parse(localStorage.getItem('appFondSize')),
      mode: JSON.parse(localStorage.getItem('appMode')),
      theme: JSON.parse(localStorage.getItem('appTheme')),
      basicAutocomplete: JSON.parse(localStorage.getItem('appBasicAutocomplete',true)),
      liveAutocomplete: JSON.parse(localStorage.getItem('appLiveAutocomplete', true)),
      gutter: JSON.parse(localStorage.getItem('appGutter', true)),
      printMargin: JSON.parse(localStorage.getItem('appPrintMargin', true)),
      activeLine: JSON.parse(localStorage.getItem('appActiveLine', true)),
      snippets: JSON.parse(localStorage.getItem('appSnippets', true)),
      lineNumber: JSON.parse(localStorage.getItem('appLineNumber', true)),
      softTabs: JSON.parse(localStorage.getItem('appSoftTabs', true)),
    }
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].tabKey === this.state.activeKey) {
        ipcRenderer.send('tabPath', this.state.tabs[i].filePath)
      }
    }
    this.addTab = this.addTab.bind(this)
    this.removeTab = this.removeTab.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.openFile = this.openFile.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.insertElement = this.insertElement.bind(this)
    this.onCursorChange = this.onCursorChange.bind(this)
  }

  onCursorChange(value) {
    this.setState({
      cursor: value
    })
  }

  onChange(activeKey) {
    this.setState({
      activeKey: activeKey
    })
    var path
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].tabKey === activeKey) {
        path = this.state.tabs[i].filePath
      }
    }
    if (path === '') {
      ipcRenderer.send('tabPath', path)
    } else {
      ipcRenderer.send('tabPath', path.toString())
    }
    localStorage.setItem('activekey', JSON.stringify(activeKey))
  };

  handleChange(ev, arg) {
    let newTab = new TabData(arg, '', '')
    let newTabs = this.state.tabs.concat(newTab)
    let key = newTab.tabKey
    this.setState({
      tabs: newTabs,
      activeKey: key
    })
    localStorage.setItem('activekey', JSON.stringify(key))
    ipcRenderer.send('tabPath', '')
  }

  openFile(ev, tabName, path) {
    let newTab
    let newTabs
    let key
    let exist = false
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].filePath.toString() === path.toString()) {
        key = this.state.tabs[i].tabKey
        exist = true
      }
    }
    if (exist) {
      this.setState({
        activeKey: key
      })
      ipcRenderer.send('tabPath', path.toString())
    } else {
      let data
      try {
        data = fs.readFileSync(path[0], 'utf-8')
      } catch (err) {
        return
      }
      ipcRenderer.send('tabPath', path[0])
      newTab = new TabData(tabName, path.toString(), '', data)
      newTabs = this.state.tabs.concat(newTab)
    }
    this.setState({
      tabs: newTabs,
      activeKey: newTab.tabKey
    })
    localStorage.setItem('activekey', JSON.stringify(this.state.activeKey))
  }

  saveFile(ev, tabName, path) {
    let index
    let newTab
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].tabKey === this.state.activeKey) {
        index = i
        newTab = new TabData(tabName, path, this.state.tabs[i].tabKey, this.state.tabs[i].content)
        ipcRenderer.send('tabPath', path)
      }
    }
    this.state.tabs.splice(index, 1, newTab)
    let newTabs = this.state.tabs

    this.setState({
      tabs: newTabs
    })
    ipcRenderer.send('tabPath', '')
    localStorage.setItem('activekey', JSON.stringify(newTabs.tabKey))
  };

  insertElement(ev, arg, path) {
    let tab = this.state.tabs
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].tabKey === this.state.activeKey) {
        let data = fs.readFileSync(path, 'utf8')

        var editor = ace.edit(this.state.activeKey);
        editor.session.insert(editor.getCursorPosition(), data)
      }
    }
  }

  onChangeText(newValue) {
    let tab = this.state.tabs
    for (let i = 0; i < tab.length; i++) {
      if (this.state.tabs[i].tabKey === this.state.activeKey) {
        tab[i].content = newValue
      }
      this.setState({
        tabs: tab
      })
    }

    ipcRenderer.send('asynchronous-message', newValue)
  }

  componentDidMount() {
    ipcRenderer.on('NewFileMessage', this.handleChange.bind(this))
    ipcRenderer.on('OpenFile', this.openFile.bind(this))
    ipcRenderer.on('saveFile', this.saveFile.bind(this))
    ipcRenderer.on('insertElement', this.insertElement.bind(this))
    ipcRenderer.on('appSettings', (ev, background, textColor, fontSize,
      mode, theme, basicAutocomplete, liveAutocomplete, gutter, printMargin,
      activeLine, snippets, lineNumber, softTabs) => {
      this.setState({
        backgroundColor: background,
        textColor: textColor,
        fondSize: fontSize.value,
        mode: mode.value,
        theme: theme.value,
        basicAutocomplete: basicAutocomplete,
        liveAutocomplete: liveAutocomplete,
        gutter: gutter,
        printMargin: printMargin,
        activeLine: activeLine,
        snippets: snippets,
        lineNumber: lineNumber,
        softTabs: softTabs
      })
      localStorage.setItem('appBackgroundColor', JSON.stringify(background))
      localStorage.setItem('appTextColor', JSON.stringify(textColor))
      localStorage.setItem('appFondSize', JSON.stringify(fontSize.value))
      localStorage.setItem('appMode', JSON.stringify(mode.value))
      localStorage.setItem('appTheme', JSON.stringify(theme.value))
      localStorage.setItem('appBasicAutocomplete', JSON.stringify(theme.value))
      localStorage.setItem('appLiveAutocomplete', JSON.stringify(theme.value))
      localStorage.setItem('appGutter', JSON.stringify(theme.value))
      localStorage.setItem('appPrintMargin', JSON.stringify(theme.value))
      localStorage.setItem('appActiveLine', JSON.stringify(theme.value))
      localStorage.setItem('appSnippets', JSON.stringify(theme.value))
      localStorage.setItem('appLineNumber', JSON.stringify(theme.value))
      localStorage.setItem('appSoftTabs', JSON.stringify(theme.value))
    })
    setInterval(function () {
      localStorage.setItem('tab', JSON.stringify(this.state.tabs))
      localStorage.setItem('activeKey', JSON.stringify(this.state.activeKey))
    }.bind(this), 3000)
  }


  TabPane() {

    return this.state.tabs.map((tabb) => {

      const tooltipStyle = {
        overflow: 'visible',
        position: 'absolute'
      }
      const textAreaStyle = {
        position: 'relative',
        height: '100%',
        width: '100%'
      }

      return (
        <TabPane
          tab={<a data-tip data-for='sadFace' ><AwesomeButton bubbles={true}
          >{tabb.tabTitle}
            <span
              style={{
                position: 'relative',
                cursor: 'pointer',
                top: 5,
                left: 10
              }}
              onClick={this.removeTab.bind(this, tabb.tabKey)}
            ><CloseButton size={20} color={"#ffb90f"} />
            </span>

          </AwesomeButton>
          </a>
          }
          key={tabb.tabKey}

        >
          <AceEditor
            style={textAreaStyle}
            mode={this.state.mode}
            theme={this.state.theme}
            name={tabb.tabKey}
            fontSize={this.state.fondSize}
            onChange={this.onChangeText}
            onCursorChange={(value) => this.onCursorChange(value)}
            value={tabb.content}
            showPrintMargin={this.state.printMargin}
            showGutter={this.state.gutter}
            highlightActiveLine={this.state.activeLine}
            enableBasicAutocompletion={this.state.basicAutocomplete}
            enableLiveAutocompletion={this.state.liveAutocomplete}
            enableSnippets={this.state.snippets}
            setOptions={{
              enableBasicAutocompletion: this.state.basicAutocomplete,
              enableLiveAutocompletion: this.state.liveAutocomplete,
              enableSnippets: this.state.snippets,
              showLineNumbers: this.state.lineNumber,
              tabSize: 4,
            }}
            editorProps={{
              $blockScrolling: true
            }}
          />
        </TabPane>
      )
    }).concat([
      <TabPane
        tab={<PlusButton onClick={(_element, next) => this.addTab(next)} color={"#ffb90f"} thickness={3} style={{ position: 'relative', cursor: 'pointer', top: 4 }} />}
        disabled={true}
        key="__add"
      />,
    ])

  }

  addTab(e) {
    let newTab = new TabData()
    let newTabs = this.state.tabs.concat(newTab)
    this.setState({
      tabs: newTabs,
      activeKey: newTab.tabKey
    })
    ipcRenderer.send('tabPath', '')
  }

  removeTab(t, e) {
    e.stopPropagation()
    if (this.state.tabs.length === 1) {
      this.state.tabs.pop()
      this.addTab(e)
      return;
    }
    let foundIndex = 0;
    const afterRemove = this.state.tabs.filter((tab, i) => {
      if (tab.tabKey !== t) {
        return true;
      }
      if (i === this.state.tabs.length - 1) {
        foundIndex = i - 1
      }
      else {
        foundIndex = i;
      }
    });
    let activeKey = this.state.activeKey;
    if (activeKey === t) {
      activeKey = afterRemove[foundIndex].tabKey;
    }

    this.setState({
      tabs: afterRemove,
      activeKey: activeKey
    });
    ipcRenderer.send('tabPath', afterRemove[foundIndex].filePath)
  }

  render() {
    let style = {
      height: "auto",
      overflow: 'none'
    }
    let textAreaStyle = {
      height: '90%',
      overflow: 'none'
    }
    return (
      <Tabs style={style}
        destroyInactiveTabPane
        forceRender={true}
        animatedWithMargin={true}
        activeKey={this.state.activeKey}
        renderTabBar={() => <ScrollableInkTabBar
        />
        }
        renderTabContent={() =>
          <TabContent style={textAreaStyle} />
        }
        onChange={this.onChange}
      >
        {this.TabPane()}

      </Tabs>
    )
  }
}

