'use strict'

import React from 'react'
import {ipcRenderer} from 'electron'
import {AwesomeButton} from 'react-awesome-button'
import SplitPane from 'react-split-pane'
import TabsPane from './TabsPane'
import Validate from './validate'
import Solve from './solve'
import Cons from './Console'
import {  NavButton } from 'react-svg-buttons'
import '../img/settings-48.png'
import buttonStyle from './ButtonStyle.css'



export default class App extends React.Component {
  constructor(props) {
    super(props);
  this.state = JSON.parse(localStorage.getItem('size'|| ''))
  this.handleResize = this.handleResize.bind(this)
  this.onClick = this.onClick.bind(this)
  this.getPath = this.getPath.bind(this);
  this.onResize = this.onResize.bind(this)
 }

 getPath (currentPath) {
   this.setState({
     path: currentPath
   })
 }

 onResize(){
  this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  })
  localStorage.setItem('size', JSON.stringify(this.state))
 }
 
  
  handleResize() { 
    this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  })
  localStorage.setItem('size', JSON.stringify(this.state))
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

  onClick(){
    if(this.state.navState)
    {
      this.setState({
        navState: false,
        navWidth: 55,
        size: "auto",
        settings: "",
        settingsIcon: <img src={'../img/settings-48.png'} style={{position: 'absolute', cursor: 'pointer', top: 2,left:2 }}></img>
      })
    }
    else{
      this.setState({
        navState: true,
        navWidth: 250,
        size: "large",
        settings: "Settings",
        settingsIcon: null
      })
    }
  }

  

  render () {
    let style = {
      background: '#373a47',
      height: "100%"
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
        height: '100%',
        marginTop: -61,
        color:"#ffb90f",
        fontSize: 80,
        fontWeight:'bold',
        textAlign:'center',
        textAlignVertical:'center'
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
            style={{position: 'relative', cursor: 'pointer', top: 4 }}
            onClick={this.onClick}/>
            <div style={menuStyle}>Menu</div>
            <div style={lineStyle}>_____________________</div>
            <Solve path = {this.state.path} > </Solve>
            <div style={divStyle}>
            <AwesomeButton style = {buttonStyle}
              size ={this.state.size}                
            >
            {this.state.settingsIcon}
            {this.state.settings}
            
            
            </AwesomeButton>
            </div>
           
          </div>
          
          <SplitPane
            split='horizontal'
            defaultSize={this.state.windowHeight-100}
            minSize={100}
            maxSize={this.state.windowHeight-100}
            onChange={this.onResize}
            >

            <TabsPane path={this.props.path}/>
            
            <div style={{height: '100%'}}>
              <Cons />
            </div>
          </SplitPane>
          </SplitPane>
        
      </div>
    )
  }
}
