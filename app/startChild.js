'use strict'
import React from 'react'
import {ipcRenderer} from 'electron'
import {AwesomeButton} from 'react-awesome-button'
import Toggle from 'react-toggle'
import "react-toggle/style.css"

export default class Start extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      workingDir: JSON.parse(localStorage.getItem('childStateWorkDir'|| '')),
      refUnitPath: JSON.parse(localStorage.getItem('childStateRefUnit'|| '')),
    }
    this.onClickOkButton = this.onClickOkButton.bind(this)
    this.onClickCloseButton = this.onClickCloseButton.bind(this)
    this.onClickWorkDirBrowseButton = this.onClickWorkDirBrowseButton.bind(this)
    this.onClickRefUnitBrowseButton = this.onClickRefUnitBrowseButton.bind(this)
    this.updateWorkDirInputValue = this.updateWorkDirInputValue.bind(this)
    this.updateRefUnitInputValue = this.updateRefUnitInputValue.bind(this)
  }

  updateWorkDirInputValue(evt) {
    this.setState({
      workingDir: evt.target.value
    });
  }

  updateRefUnitInputValue(evt) {
    this.setState({
      refUnitPath: evt.target.value
    });
  }

  onClickOkButton(){
    ipcRenderer.send('startPageOkButton', this.state.workingDir, this.state.refUnitPath)
  }

  onClickCloseButton(){
    ipcRenderer.send('startPageCloseButton', this.state.workingDir, this.state.refUnitPath)
  }

  onClickWorkDirBrowseButton(){
    ipcRenderer.send('brosweWorkDirButtonClicked', true)
  }

  onClickRefUnitBrowseButton(){
    ipcRenderer.send('brosweRefUnitButtonClicked', true)
  }

  componentDidMount(){
    ipcRenderer.on('selectedWorkDirPath',(event, result) => {
      this.setState({
        workingDir: result
      })
      document.getElementById("workDirPath").setAttribute('value', result);
      localStorage.setItem('childStateWorkDir', JSON.stringify(this.state.workingDir))
    })
    ipcRenderer.on('selectedRefUnitPath',(event, result) => {
      this.setState({
        refUnitPath: result
      })
      document.getElementById("refUnitPath").setAttribute('value', result);
      localStorage.setItem('childStateRefUnit', JSON.stringify(this.state.refUnitPath))
    })
  }
 
  render () {
    const divStyle = {
      position: 'relative',
      textAlign: 'center',
      fontSize: 'large',

    }
  
    return (
      <div style = {divStyle}>
          <label style = {{color:"#ffb90f"}}>Working Directory: </label>
          <input id = "workDirPath" value = {this.state.workingDir} onChange={this.updateWorkDirInputValue} type="text" style={{width: "500px", height: "30px", fontSize: "12pt", marginRight: 5, marginLeft: 10}}></input>
          <AwesomeButton size="small" action={(_element, next) => this.onClickWorkDirBrowseButton(next)} > Browse... </AwesomeButton>
          <label style = {{color:"#ffb90f"}}>Reference Unit Path: </label>
          <input id = "refUnitPath"  value = {this.state.refUnitPath} onChange={this.updateRefUnitInputValue} style={{width: "500px", height: "30px", fontSize: "12pt", marginRight: 5}}></input>
          <AwesomeButton size="small" action={(_element, next) => this.onClickRefUnitBrowseButton(next)} > Browse... </AwesomeButton>

          <AwesomeButton size="small" style = {{position:'absolute', right: 120, bottom: -80}}  action={(_element, next) => this.onClickOkButton(next)} > OK </AwesomeButton>
          <AwesomeButton size="small" style = {{position:'absolute', right: 10, bottom: -80}}   action={(_element, next) => this.onClickCloseButton(next)} > Close </AwesomeButton>

          <div style={{ position:'absolute', left: 100, bottom: -75}}>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style = {{color:"#ffb90f"}}>Don't show this again</span>
          </div >

      </div>
    )
  }
}
