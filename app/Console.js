'use strict'

import React from 'react'
import { ipcRenderer } from 'electron'

export default class Cons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: JSON.parse(localStorage.getItem('appBackgroundColor')),
      textColor: JSON.parse(localStorage.getItem('appTextColor')),
    }
  }

 componentDidMount() {
  ipcRenderer.on('appSettings', (ev,background,textColor) => {
    this.setState({
      backgroundColor: background,
      textColor: textColor
    })
  })
 }
  render () {
    const divStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    const textareaStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%',
      resize: 'none',
      background: this.state.backgroundColor,
      color: this.state.textColor,
      fontSize: "12pt"
      
    }
    return (
      <div style={divStyle}>
        <textarea id='output' style={textareaStyle} disabled />
      </div>
    )
  }
}
