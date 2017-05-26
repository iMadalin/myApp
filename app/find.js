'use strict'

// Import React, otherwise get Uncaught ReferenceError: React is not defined
import React from 'react'
import ReactDom from 'react-dom'
import FindInPage from './findInPage'

ReactDom.render(<FindInPage />, document.getElementById('find')|| document.createElement('div'))
