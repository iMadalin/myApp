'use strict'

// Import React, otherwise get Uncaught ReferenceError: React is not defined
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

ReactDom.render(<App />, document.getElementById('app') || document.createElement('div'))
