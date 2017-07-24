'use strict'

import React from 'react'
import {ApButton} from 'apeman-react-button'

export default class Validate extends React.Component {
  render () {
    const divStyle = {
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    return (
      <div style={divStyle}>
        <ApButton>
          Validate
        </ApButton>
      </div>
    )
  }
}
