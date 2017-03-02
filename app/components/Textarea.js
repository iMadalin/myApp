import React, { Component } from 'react';
import autosize from 'autosize';

class TextArea extends Component {
  componentDidMount(){
    this.textarea.focus();
    autosize(this.textarea);
  }
  render() {
    const textareaStyle =  {
      width: 1600,
      border: 'none',
      resize: 'none',
      padding: "5px",
      background: "grey"
    };

    return (
      <div className= "openFile">
            <textarea
            style = {textareaStyle}
            defaultValue=""
            />
            </div>
    )
  }
}

export default TextArea;
