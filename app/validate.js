'use strict'

import React from 'react'
import {AwesomeButton} from 'react-awesome-button'

export default class Validate extends React.Component {
  render () {
    const divStyle = {
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    return (
     // <div style={divStyle}>
        <AwesomeButton size="large">
         Validate
        </AwesomeButton>
    //  </div>
    )
  }
}
