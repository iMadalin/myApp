import React from 'react'
import Tabs, { TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import {ipcRenderer, autoUpdater} from 'electron'
import fs from 'fs'
import localStorage from 'localStorage'
import {AwesomeButton} from 'react-awesome-button'
import 'react-awesome-button/src/styles/styles.scss'
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/theme/monokai';


function TabData (title, path, key = undefined, content = '') {
  this.tabKey = key || 'tab_' + Date.now()
  this.tabTitle = title || 'untitled'
  this.filePath = path || ''
  this.content = content
  this.oldContent = 0
}

export default class TabsPane extends React.Component {
  constructor (props) {
    super(props)
    let tab = new TabData()
    this.state = JSON.parse(localStorage.getItem('tab') || tab)
    this.addTab = this.addTab.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.openFile = this.openFile.bind(this)
    this.saveFile = this.saveFile.bind(this)
   // this.onChange = this.onChangeText.bind(this);
  }

  onChangeText(newText){
    ipcRenderer.send('asynchronous-message', newText)
  }
  onChange (activeKey) {
    this.setState({
      activeKey
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
      let tabPath = path.toString()
      ipcRenderer.send('tabPath', tabPath)
    }
  };

  handleChange (ev, arg) {
    let newTab = new TabData(arg, '', '')
    let newTabs = this.state.tabs.concat(newTab)
    let key = newTab.tabKey
    this.setState({
      tabs: newTabs,
      activeKey: key
    })
    ipcRenderer.send('tabPath', '')
  }

  openFile (ev, tabName, path) {
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
  }

  saveFile (ev, tabName, path) {
    let index
    let newTab
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].tabKey === this.state.activeKey) {
        index = i
        newTab = new TabData(tabName, path, this.state.tabs[i].tabKey)
        ipcRenderer.send('tabPath', path)
      }
    }
    this.state.tabs.splice(index, 1, newTab)
    let newTabs = this.state.tabs

    this.setState({
      tabs: newTabs
    })
    ipcRenderer.send('tabPath', '')
  };

  newLink (ev, arg, path) {
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].tabKey === this.state.activeKey) {
        let index = 0
        let data = fs.readFileSync(path, 'utf8')
        let textarea = document.getElementById(this.state.tabs[i].tabKey)
        index = textarea.selectionStart
        console.log(index)

        let tabs = this.state.tabs

        tabs[i].content = arg
        tabs[i].content = tabs[i].content.slice(0, index) + data + tabs[i].content.slice(index)
        ipcRenderer.send('asynchronous-message', tabs[i].content)

        this.setState({
          tabs: tabs
        })
      }
    }
  }

  componentDidMount () {
    ipcRenderer.on('NewFileMessage', this.handleChange.bind(this))
    ipcRenderer.on('OpenFile', this.openFile.bind(this))
    ipcRenderer.on('saveFile', this.saveFile.bind(this))
    ipcRenderer.on('newLink', this.newLink.bind(this))

    setInterval(function () {
      localStorage.setItem('tab', JSON.stringify(this.state))
    }.bind(this), 1000)

  }

  TabPane () {
    console.log('TabPane() called')
    let style = {
      overflow: 'hidden',
      height: '100%'
    }

    return this.state.tabs.map((tabb) => {
      const divStyle = {
        flex: 1,
        position: 'relative',
        outline: 'none',
        height: '100%',
        width: '100%'
      }

      const textAreaStyle = {
        position: 'relative',
        height: '100%',
        width: '100%'
      }
      return (
        <TabPane style={style}
          tab={<span>{tabb.tabTitle}
            <a
              style={{
                position: 'absolute',
                cursor: 'pointer',
                color: 'red',
                right: 5,
                top: 0
              }}
              onClick={this.removeTab.bind(this, tabb.tabKey)}
          >x</a>
          
          </span>}
          key={tabb.tabKey}
        >
        <div style={divStyle}>
        <AceEditor 
          style={textAreaStyle}
          mode="xml"
          theme="monokai"
          name = {tabb.tabKey}
          fontSize={14} 
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4,
            }}
        />
          
        </div>

        </TabPane>
      )
    })
  }

  onChangeTextArea (ev) {
    let tabs = this.state.tabs
    for (let i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].tabKey === this.state.activeKey) {
        tabs[i].content = ev.target.value
        this.setState({
          tabs: tabs
        })
      }
    }
    ipcRenderer.send('asynchronous-message', ev.target.value)
  }

  addTab (e) {
    let newTab = new TabData()
    let newTabs = this.state.tabs.concat(newTab)
    this.setState({
      tabs: newTabs,
      activeKey: newTab.tabKey
    })
    ipcRenderer.send('tabPath', '')
  }

  removeTab (t, e) {
    e.stopPropagation()
    let activeKey = this.state.activeKey
    const tabs = this.state.tabs.filter((tab) => {
      if (tab.tabKey !== t) {
        return true
      }
    })
    this.setState({
      tabs: tabs,
      activeKey
    })
  }

  render () {
    let style = {
      overflow: 'hidden'
    }
    let textAreaStyle = {
      height: '94%'
    }
    return (
      <Tabs style={style}
        renderTabBar={() => <ScrollableInkTabBar
          extraContent={
              <AwesomeButton action={(_element, next) => this.addTab(next)}>+</AwesomeButton>            
          }
          />
        }
        activeKey={this.state.activeKey}
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
