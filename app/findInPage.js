'use strict'
import React from 'react'
import {ipcRenderer} from 'electron'
import {AwesomeButton} from 'react-awesome-button'
import {
  MorphIcon,
  CloseButton,
} from 'react-svg-buttons'
import buttonStyle from './ButtonStyle.css'

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

  findNext () {
    ipcRenderer.send('findNext', "")
  }

  stopFind () {
    ipcRenderer.send('stopFind', "")
  }
  resultMatches (ev, arg) {
    this.setState({
      resultMatches: arg
    })
  }
  componentDidMount () {
    ipcRenderer.on('resultMatches', this.resultMatches.bind(this))
  }

  render () {
    const divStyle = {
      overflow: 'hidden',
      position: 'relative',
      textAlign: 'center'
    }
    const inputStyle = {
      width: '60%',
      fontSize: 20

    }
    const resultMatchesStyle = {
      width: '20%',
      fontSize: 20
    }
    const buttonsStyle ={
      margin: 10
    }
    return (
      <div style={divStyle}>
        <input style={inputStyle} value={this.state.content} onChange={this.handleChange.bind(this)} />
        <input style={resultMatchesStyle} value={this.state.resultMatches} onChange={this.resultMatches.bind(this)} disabled />
        <a>
          {/* <AwesomeButton style={buttonsStyle} size="small" action={(_element, next) => this.findNext(next)} simple > Next </AwesomeButton> */}
         {/* <AwesomeButton size="auto" style={buttonsStyle} action={(_element, next) => this.findNext(next)} simple><MorphIcon type="arrowLeft"  size={48} thickness={2} color="#ff9e3e"/></AwesomeButton>  */}
         <AwesomeButton size="auto" style={buttonsStyle} action={(_element, next) => this.findNext(next)} simple><MorphIcon type="arrowRight"  size={48} thickness={2} color="#ff9e3e" style={{top:5}}/></AwesomeButton>
         <AwesomeButton size="auto" style={buttonsStyle} action={(_element, next) => this.stopFind(next)} simple><CloseButton  thickness={2} size={40} color="#ff9e3e"></CloseButton></AwesomeButton>
        </a>
      </div>
    )
  }
}
