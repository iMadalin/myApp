'use strict'

// Import React, otherwise get Uncaught ReferenceError: React is not defined
import React from 'react'
import ReactDom from 'react-dom'
import Settings from "./settings";

ReactDom.render(<Settings/>, document.getElementById('settings') || document.createElement('div'))
