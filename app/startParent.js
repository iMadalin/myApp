'use strict'

// Import React, otherwise get Uncaught ReferenceError: React is not defined
import React from 'react'
import ReactDom from 'react-dom'
import Start from './startChild'

ReactDom.render(<Start />, document.getElementById('start') || document.createElement('div'))
