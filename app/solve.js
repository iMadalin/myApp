'use strict'

import React from 'react'
import {ApButton} from 'apeman-react-button'
const { exec } = require('child_process')

export default class Solve extends React.Component {
  handleClick (e) {
    exec('my.bat', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        document.getElementById('output').value = err
        return
      }
      console.log(stdout)
      document.getElementById('output').value = stdout
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
