'use strict'

// Import React, otherwise get Uncaught ReferenceError: React is not defined
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import FindInPage from './findInPage'

ReactDOM.render(<FindInPage />, document.getElementById('find'))
ReactDOM.render(<App />, document.getElementById('app'))
