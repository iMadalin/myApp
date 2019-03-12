'use strict'

import React from 'react'
import {AwesomeButton} from 'react-awesome-button'
import assert from'assert'
import fs from'fs'
const { spawn } = require('child_process')

export default class Validate extends React.Component {
  handleClick (e) {
    spawn('cmd.exe', ['/c', 'validate.bat'])
    const validate = spawn('cmd.exe', ['/c', 'myFile.exe'])
    validate.stdout.on('data', (data) => {
      console.log(data.toString())
      document.getElementById('output').value += data.toString()
    })

    validate.stderr.on('data', (data) => {
      console.log(data.toString())
      document.getElementById('output').value += data.toString()
    })
    
   /// var childProcess = require("child_process");
   /// const sitemap = fs.readFileSync('.\\1847\\Mechanism.xsd', 'utf8');
  //  console.log(sitemap)
  //  const schema = fs.readFileSync('AdvancedSolutionCCode.mdef', 'utf8');

   
   // var validator = require('xsd-schema-validator');
 
  //  validator.validateXML('AdvancedSolutionCCode.mdef', '.\\1847\\Mechanism.xsd', function(err, result) {
   //   if (err) {
   //     throw err;
  //    }
     
  //    result.valid; // true
  //  });
  }
  render () {
    const divStyle = {
      position: 'relative',
      overflow: 'hidden',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    return (
      <div style={divStyle}>
        <AwesomeButton  size="large" action={(_element, next) => this.handleClick(next)}>
         Validate
        </AwesomeButton>
      </div>
    )
  }
}
