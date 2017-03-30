
import React, { Component, PropTypes } from 'react';
import Prefixer from 'inline-style-prefixer';
import { WindowResizeListener } from 'react-window-resize-listener';
import stylePropType from 'react-style-proptype';
import $ from 'jquery';




class TextArea extends Component {


  render() {



    const divStyle =  {
        flex: 1,
        position: 'relative',
        outline: 'none',
        height: '100%',
        width: '100%'
    }
    const textareaStyle =  {
        flex: 1,
        position: 'relative',
        outline: 'none',
        height: '100%',
        width: '100%',
        resize: 'none'
    }


    return (
      <div style = {divStyle} >
            <textarea id="output_field"
            style = {textareaStyle}
            />
      </div>
    )
  }
}

export default TextArea;
