'use strict'

import React from 'react'
import {AwesomeButton} from 'react-awesome-button'
import PropTypes from 'prop-types'
const { spawn } = require('child_process')
import {ipcRenderer} from 'electron'

export default class Solve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "",
      workDir: "",
      refUnit: ""
    }
 
  this.handleClickSolve = this.handleClickSolve.bind(this)
  this.handleClickSolve = this.handleClickSolve.bind(this)
  this.getWorkPath = this.getWorkPath.bind(this)

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

  componentDidMount() {
    ipcRenderer.on('WorkDirAndRefUnitPath', this.getWorkPath.bind(this)) 
  }

  render () {
    const divStyle = {
      position: 'relative',
      overflow: 'hidden',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    return (
      <div style={divStyle}>
        <AwesomeButton size="large" action={(_element, next) => this.handleClickValidate(next)} >
         Validate 
        </AwesomeButton>
        <AwesomeButton size="large" action={(_element, next) => this.handleClickSolve(next)} >
         Solve 
        </AwesomeButton>
      </div>
    )
  }
}