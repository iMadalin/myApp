import React from 'react'
import Tabs, { TabPane } from 'rc-tabs'
import TabContent from 'rc-tabs/lib/TabContent'
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar'
import {ipcRenderer, autoUpdater} from 'electron'
import fs from 'fs'
import localStorage from 'localStorage'
import {AwesomeButton} from 'react-awesome-button'
import 'react-awesome-button/src/styles/themes/theme-c137'
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/xml';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import {
  CloseButton,
  NavButton,
  PlusButton,
} from 'react-svg-buttons'
import buttonStyle from './ButtonStyle.css'

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
    this.state = //{
   //   tabs: 
   JSON.parse(localStorage.getItem('tab'|| '{}'))
   //   activeKey:undefined,
   //   cursor: undefined
   // }
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

 // get initialState(){
 //   let tab = new TabData()
 //   if(localStorage.getItem('tab')){
 //     return JSON.parse(localStorage.getItem('tab') || '{}')
 //   }
 //   else{
 //     return {
 //       tabs: [tab],
 //       activeKey: tab.tabKey
 //     }
 //   }
 // }

 onCursorChange(value) {
   this.setState({
   cursor: value
   })
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
        newTab = new TabData(tabName, path, this.state.tabs[i].tabKey, this.state.tabs[i].content)
        ipcRenderer.send('tabPath', path)
      }
    }
    this.state.tabs.splice(index, 1, newTab)
    let newTabs = this.state.tabs

    this.setState({
      tabs: newTabs
    })
   // ipcRenderer.send('tabPath', '')
  };

  insertElement (ev, arg, path) {
    let tab = this.state.tabs
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].tabKey === this.state.activeKey) {
        let data = fs.readFileSync(path, 'utf8')
   
        var editor = ace.edit(this.state.activeKey);
        editor.session.insert(editor.getCursorPosition(), data )
       // ipcRenderer.send('asynchronous-message', tab[i].content)
      }
    }
  }

  onChangeText (newValue) {
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

  componentDidMount () {
    ipcRenderer.on('NewFileMessage', this.handleChange.bind(this))
    ipcRenderer.on('OpenFile', this.openFile.bind(this))
    ipcRenderer.on('saveFile', this.saveFile.bind(this))
    ipcRenderer.on('insertElement', this.insertElement.bind(this))
    setInterval(function () {
      localStorage.setItem('tab', JSON.stringify(this.state))
    }.bind(this), 1000)

  }

  TabPane () {
    let style = {
      overflow: 'hidden',
      height: '100%',

    }



    return this.state.tabs.map((tabb) => {

      const textAreaStyle = {
        position: 'relative',
        height: '100%',
        width: '100%' 
      }

      return (
        <TabPane 
          tab={ <AwesomeButton style = {buttonStyle}  bubbles={true}
          >{tabb.tabTitle}
            <span
              style={{
                position: 'relative',
                cursor: 'pointer',
                top: 5,
                left:10
              }}
              onClick={this.removeTab.bind(this,tabb.tabKey) }
          ><CloseButton size = {20} color = "#ffb90f" /></span>
          
          </AwesomeButton>}
          key={tabb.tabKey}
          >
        <AceEditor 
          style={textAreaStyle}
          mode={'xml'}
          theme={'monokai'}
          name = {tabb.tabKey}
          fontSize={14} 
          onChange = { this.onChangeText }
          onCursorChange = {(value)=> this.onCursorChange(value)}
          value = {tabb.content}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion = {true}
          enableSnippets = {true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
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
      tab={ <PlusButton  onClick={(_element, next) => this.addTab(next)} color="#ffb90f" thickness={3} style={{position: 'relative', cursor: 'pointer', top: 4 }} />}
        disabled={true}
        key="__add"
      />,
    ])
    
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
    if (this.state.tabs.length === 1) {
      alert('de ce vrei sa stergi singurul tab, acum trebuie sa il inlocuiesc cu unul nou!');
      return;
    }
    let foundIndex = 0;
    const afterRemove = this.state.tabs.filter((tab,i) => {
      if (tab.tabKey !== t) {
        return true;
      }   
      if(i === this.state.tabs.length-1){
        foundIndex = i-1
      }
      else{
        foundIndex = i;
      }
    });
    let activeKey = this.state.activeKey;
    if (activeKey === t) {
       activeKey = afterRemove[foundIndex].tabKey;
    }
   
    this.setState({
      tabs: afterRemove,
      activeKey
    });
  }

  render () {
    let style = {
      overflow: 'hidden',
    }
    let textAreaStyle = {
      height: '94%'
    }
    return (
      <Tabs style={style}
      forceRender ={true}
      animatedWithMargin={true}
      activeKey={this.state.activeKey}
        renderTabBar={() => <ScrollableInkTabBar
          extraContent={
              <PlusButton onClick={(_element, next) => this.addTab(next)} thickness={3} color="#ffb90f" style={{position: 'relative', cursor: 'pointer', top: 10 }}></PlusButton>           
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
