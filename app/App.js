'use strict'

import React from 'react'
import SplitPane from 'react-split-pane'
import TabsPane from './TabsPane'
import Validate from './validate'
import Solve from './solve'
import Cons from './Console'
import { slide as Menu } from 'react-burger-menu'
import {  NavButton } from 'react-svg-buttons'
import '../img/settings-48.png'



export default class App extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    windowHeight: undefined,
    windowWidth: undefined,
    navState: false,
    navWidth: 55
  }
  this.handleResize = this.handleResize.bind(this)
  this.onClick = this.onClick.bind(this)
 }
  
  handleResize() { this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  })}

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  onClick(){
    if(this.state.navState)
    {
      this.setState({
        navState: false,
        navWidth: 55
      })
    }
    else{
      this.setState({
        navState: true,
        navWidth: 250
      })
    }
  }

  render () {
    let style = {
      background: '#373a47'
    }   
    
    let menuStyle={
      pozition: 'relative',
      overflow: 'hidden',
      marginTop: -50,
      marginLeft: 55,
      marginRight: 25,
      color:"#ffb90f",
      fontSize: 40,
      textAlign:'center',
      textAlignVertical:'center'
      }
      let lineStyle={
        pozition: 'relative',
        overflow: 'hidden',
        marginTop: -63,
        color:"#ffb90f",
        fontSize: 80,
        fontWeight:'bold',
        textAlign:'center',
        textAlignVertical:'center'
        }
        let settingsStyle={
          pozition: 'relative',
          overflow: 'hidden',
          color:"#ffb90f",
          fontSize: 40,
          background:"transparent",
          type: 'link'
          }
    return (
      <div>  
        <SplitPane
          split={'vertical'}
          minSize={this.state.navWidth}
          maxSize={this.state.navWidth}
          defaultSize={this.state.navWidth}
          style={style}
        >
          <div>
          <NavButton direction="right"
            opened={this.state.navState} 
            color="#ffb90f" thickness={3} 
            style={{position: 'relative', cursor: 'pointer', top: 4 }}
            onClick={this.onClick}/>
            <div style={menuStyle}>Menu</div>
            <div style={lineStyle}>_____________________</div>
            <button style="link" style = {settingsStyle}><img src={'../img/settings-48.png'}></img>Settings</button>
          </div>
          <SplitPane
            split='horizontal'
            minSize={100}
            defaultSize={this.state.windowHeight-100}
            maxSize={this.state.windowHeight-100}
            >

            <TabsPane/>
            <div style={{height: '100%'}}>
              <Cons />
            </div>
          </SplitPane>
          </SplitPane>
        
      </div>
    )
  }
}
