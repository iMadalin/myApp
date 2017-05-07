import TextArea from './TextArea'
import React from 'react'
import Tabs, { TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import {ipcRenderer} from 'electron'

// We may also want to pass the key, to ease copying
function TabData (title, path, key = undefined) {
  this.tabKey = key || 'tab_' + Date.now()
  this.tabTitle = title || 'untitled'
  this.filePath = path || null
  this.content = ''

  // this could be a hash corresponding to the last known content
  // by computing the current hash and comparing it to this,
  // we know if the content we're displaying is saved
  this.oldContent = 0
}

export default class TabsPane extends React.Component {
  constructor (props) {
    super(props)

    let tab = new TabData()
    this.state = {
      tabs: [tab],
      activeKey: tab.tabKey
    }
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
    if (path === null) {
      path = ''
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
    let newTab = new TabData(tabName, path, '')
    let newTabs = this.state.tabs.concat(newTab)
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
          <TextArea style={style} id={tab.tabKey} />
        </TabPane>
      )
    }).concat([
      <TabPane
        tab={<a style={{ color: 'black', cursor: 'pointer' }} onClick={this.addTab}> + addTab</a>}
       />
    ])
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
  //  if (newState.length === 1) {
  //     return;
  //  }
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
            <button onClick={this.addTab}>+addTab</button>
                 }
               />}
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
