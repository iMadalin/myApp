'use strict'

import React from 'react'

export default class Cons extends React.Component {
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
      background: '#373a47',
      color: "#ffffff",
      fontSize: "12pt"
      
    }
    return (
      <div style={divStyle}>
        <textarea id='output' style={textareaStyle} disabled />
      </div>
    )
  }
}
