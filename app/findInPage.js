'use strict'
import React from 'react'
import {ipcRenderer} from 'electron'

export default class FindInPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: this.props.content,
      resultMatches: this.props.resultMatches
    }
    this.handleChange = this.handleChange.bind(this)
    this.findNext = this.findNext.bind(this)
    this.resultMatches = this.resultMatches.bind(this)
  }

  handleChange (ev, arg) {
    this.setState({
      contnet: ev.target.value
    })
    ipcRenderer.send('findString', ev.target.value)
  }

  findNext (ev, arg) {
    ipcRenderer.send('findNext', 'next')
  }

  stopFind (ev, arg) {
    ipcRenderer.send('stopFind', ev.target.value)
  }
  resultMatches(ev,arg) {
    this.setState({
      resultMatches: arg
    })
    console.log(arg)
  }
  componentDidMount () {
    ipcRenderer.on('resultMatches', this.resultMatches.bind(this))
  }

  render () {
    const divStyle = {
      overflow: 'hidden',
      position: 'relative'
    }
    const inputStyle = {
      width:'40%'
    }
    const resultMatchesStyle = {
      width:'25%'
    }

    return (
      <div style={divStyle}>
        <input style={inputStyle} value={this.state.content} onChange={this.handleChange.bind(this)} />
        <input style={resultMatchesStyle} value={this.state.resultMatches} onChange={this.resultMatches.bind(this)} disabled/>
        <button onClick={this.findNext.bind(this)}> Find </button>
        <button onClick={this.stopFind.bind(this)}>  Close </button>
      </div>
    )
  }
}
