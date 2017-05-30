import TextArea from './TextArea'
import React from 'react'
import Tabs, { TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import {ipcRenderer} from 'electron'
import fs from 'fs'
import localStorage from 'localStorage'
import {ApButtonStyle, ApButton} from 'apeman-react-button'

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
  };

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
  };

  componentDidMount () {
    ipcRenderer.on('NewFileMessage', this.handleChange.bind(this))
    ipcRenderer.on('OpenFile', this.openFile.bind(this))
    ipcRenderer.on('saveFile', this.saveFile.bind(this))
    setInterval(function () {
      this.setState({
        tabs: this.state.tabs
      })
      localStorage.setItem('tab', JSON.stringify(this.state))
    }.bind(this), 1000)
  }

  TabPane () {
    let style = {
      overflow: 'hidden',
      height: '100%'
    }
    return this.state.tabs.map((tab) => {
      return (
        <TabPane style={style}
          tab={<span>{tab.tabTitle}
            <a
              style={{
                position: 'absolute',
                cursor: 'pointer',
                color: 'red',
                right: 5,
                top: 0
              }}
              onClick={this.removeTab.bind(this, tab.tabKey)}
          >x</a>
          </span>}
          key={tab.tabKey}
        >
          <TextArea style={style} id={tab.tabKey} content={tab.content} />
        </TabPane>
      )
    })
  }

  addTab (e) {
    e.stopPropagation()
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
            <div style={style}>
              <ApButtonStyle highlightColor='#00b2ee' />
              <ApButton onClick={this.addTab} >
                +
              </ApButton>
            </div>
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
