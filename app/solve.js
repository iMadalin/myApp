'use strict'

import React from 'react'
import {AwesomeButton} from 'react-awesome-button'
const { spawn } = require('child_process')
import {ipcRenderer} from 'electron'
import buttonStyle from './ButtonStyle.css'

export default class Solve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "",
      workDir: "",
      refUnit: "",
      validate: "Validate",
      solve: "Solve",
      size: "large"
    }
 
  this.handleClickValidate = this.handleClickValidate.bind(this)
  this.handleClickSolve = this.handleClickSolve.bind(this)
  this.getWorkPath = this.getWorkPath.bind(this)
  this.navClose = this.navClose.bind(this)
  this.navOpen = this.navOpen.bind(this)

 }
 handleClickValidate (e,path) {
  document.getElementById('output').value = ''
  let solve = (this.state.refUnit + '\\wntx64\\kits\\mech\\mdf_toolkit\\Mdf.bat -validate ' + this.props.path).toString()
  console.log(solve)

  document.getElementById('output').value += solve + '\n'
  const bat = spawn('cmd.exe', ['/c', solve], {cwd: (this.state.workDir).toString()})
  bat.stdout.on('data', (data) => {
    document.getElementById('output').value += data.toString()
  })

  bat.stderr.on('data', (data) => {
    document.getElementById('output').value += data.toString()
  })
}
 
  handleClickSolve (e,path) {
    document.getElementById('output').value = ''
    let solve = (this.state.refUnit + '\\wntx64\\kits\\mech\\mdf_toolkit\\Mdf.bat -solve ' + this.props.path).toString()
    console.log(solve)

    document.getElementById('output').value += solve + '\n'
    const bat = spawn('cmd.exe', ['/c', solve], {cwd: (this.state.workDir).toString()})
    bat.stdout.on('data', (data) => {
      document.getElementById('output').value += data.toString()
    })

    bat.stderr.on('data', (data) => {
      document.getElementById('output').value += data.toString()
    })
  }

  getWorkPath(event, workDir, refUnit) {
    this.setState({
      workDir: workDir,
      refUnit: refUnit
    })
    console.log(workDir,"   ", refUnit)
  }

  navClose() {
    this.setState({
      size: "auto",
      validate: <img src={'../img/checked-48.png'} style={{ position: 'absolute', cursor: 'pointer', top: 2, left: 2 }}></img>,
      solve: <img src={'../img/calculator-48.png'} style={{ position: 'absolute', cursor: 'pointer', top: 2, left: 2 }}></img>,
    })
  }

  navOpen() {
    this.setState({
      size: "large",
      validate: "Validate",
      solve: "Solve",
    })
  }

  componentDidMount() {
    ipcRenderer.on('WorkDirAndRefUnitPath', this.getWorkPath.bind(this)) 
    ipcRenderer.on('putIcon', this.navClose.bind(this)) 
    ipcRenderer.on('putString', this.navOpen.bind(this)) 
  }

  render () {
    const divStyle = {
      position: 'relative',
      overflow: 'hidden',
      outline: 'none',
      height: '100%',
      width: '100%',
    }
    return (
      <div style={divStyle}>
        <AwesomeButton size={this.state.size} style={{buttonStyle, margin:20}} action={(_element, next) => this.handleClickValidate(next)} >
        {this.state.validate} 
        </AwesomeButton>
        <AwesomeButton size={this.state.size} style={{buttonStyle, margin:20}} action={(_element, next) => this.handleClickSolve(next)} >
        {this.state.solve}  
        </AwesomeButton>
      </div>
    )
  }
}