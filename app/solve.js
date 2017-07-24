'use strict'

import React from 'react'
import {ApButton} from 'apeman-react-button'
const { exec } = require('child_process')

export default class Solve extends React.Component {
  handleClick (e) {
    const { spawn } = require('child_process')
    const bat = spawn('cmd.exe', ['/c', 'my.bat'])

    bat.stdout.on('data', (data) => {
      console.log(data.toString())
      document.getElementById('output').value += data.toString()
    })

    bat.stderr.on('data', (data) => {
      console.log(data.toString())
      document.getElementById('output').value += data.toString()
    })
  }

  render () {
    const divStyle = {
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    return (
      <div style={divStyle}>
        <ApButton onClick={this.handleClick}>
          Solve
        </ApButton>
      </div>
    )
  }
}
