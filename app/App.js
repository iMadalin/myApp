'use strict'

import React from 'react'
import { ipcRenderer } from 'electron'
import { AwesomeButton } from 'react-awesome-button'
import SplitPane from 'react-split-pane'
import TabsPane from './TabsPane'
import Validate from './validate'
import Solve from './solve'
import Cons from './Console'
import { NavButton } from 'react-svg-buttons'
import buttonStyle from './ButtonStyle.css'
import NavDropdownMenu from './dropdownMenu'




export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        settingButton: 'Settings',
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        size: "large",
        navState: true,
        navWidth: 250,
    }
    this.handleResize = this.handleResize.bind(this)
    this.onClick = this.onClick.bind(this)
    this.getPath = this.getPath.bind(this);
    this.onResize = this.onResize.bind(this)
  }

  getPath(currentPath) {
    this.setState({
      path: currentPath
    })
  }

  onResize() {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    })

  }


  handleResize() {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    })
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
    ipcRenderer.on('currentPath', (event, result) => {
      this.setState({
        path: result
      })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  onClick() {
    if (this.state.navState) {
      this.setState({
        navState: false,
        navWidth: 80,
        size: "auto",
        settingButton: <img src={'../img/setting-48.png'} style={{ position: 'absolute', cursor: 'pointer', top: 2, left: 2 }}></img>,
      })
      ipcRenderer.send('NavIsColse', "")
    }
    else {
      this.setState({
        navState: true,
        navWidth: 250,
        size: "large",
        settingButton: "Settings",
      })
      ipcRenderer.send('NavIsOpen', "")
    }
  }

  openSettings() {
    ipcRenderer.send('openSetting', "")
  }


  render() {
    let style = {
      background: '#373a47',
      height: "100%"
    }

    let menuStyle = {
      pozition: 'relative',
      overflow: 'hidden',
      marginTop: -50,
      marginLeft: 55,
      marginRight: 25,
      color: "#ffb90f",
      fontSize: 40,
      textAlign: 'center',
      textAlignVertical: 'center'
    }
    let lineStyle = {
      pozition: 'relative',
      overflow: 'hidden',
      height: '100%',
      marginTop: -65,
      color: "#ffb90f",
      fontSize: 80,
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center'
    }
    const divStyle = {
      position: 'relative',
      overflow: 'hidden',
      outline: 'none',
      height: '100%',
      width: '100%'
    }

    return (
      <div style={style}>
        <SplitPane
          split={'vertical'}
          minSize={this.state.navWidth}
          maxSize={this.state.navWidth}
          defaultSize={this.state.navWidth}
          style={style}
        >
          <div >
            <NavButton direction="right"
              opened={this.state.navState}
              color="#ffb90f" thickness={3}
              style={{ position: 'relative', cursor: 'pointer', top: 10, left: 10}}
              onClick={this.onClick} />
            <div style={lineStyle}>_____________________</div>
            <NavDropdownMenu></NavDropdownMenu>


            <Solve path={this.state.path}> </Solve>
            <div style={divStyle}>
              <AwesomeButton style={{buttonStyle, margin:20}}
                size={this.state.size}
                action={(_element, next) => this.openSettings(next)}
              >
              {this.state.settingButton}
              </AwesomeButton>
            </div>
           
          </div>

          <SplitPane
            split='horizontal'
            defaultSize={this.state.windowHeight - 200}
            minSize={200}
            maxSize={this.state.windowHeight - 100}
            onChange={this.onResize}
          >

            <TabsPane path={this.props.path} />

            <div style={{ height: '100%' }}>
              <Cons />
            </div>
          </SplitPane>
        </SplitPane>

      </div>
    )
  }
}
