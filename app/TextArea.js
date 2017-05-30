'use strict'

import {ipcRenderer} from 'electron'
var React = require('react')

function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function offsetToRangeCharacterMove(el, offset) {
    return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
}

function insertTextAtCursor(el, text) {
    var pos = getInputSelection(el).end;
    var newPos = pos + text.length;
    var val = el.value;
    el.value = val.slice(0, pos) + text + val.slice(pos);
}


export default class TextArea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: this.props.content
    }
    this.handleChange = this.handleChange.bind(this)
    this.newLink = this.newLink.bind(this)
  }

  handleChange (ev, arg) {
    this.setState({
      content: ev.target.value
    })
    ipcRenderer.send('asynchronous-message', ev.target.value)
  }

  newLink() {
    var textarea = document.getElementById("output_field");
      textarea.focus();
      insertTextAtCursor(textarea, "[Insert]")
      return false;
      this.setState({
        content: textarea
      })
      ipcRenderer.send('asynchronous-message', ev.target.value)
  }

  componentDidMount() {
    ipcRenderer.on('newLink', this.newLink.bind(this))
  }

  render () {
    const divStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
    }
    const textareaStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%',
      resize: 'none'
    }
    return (
      <div style={divStyle} >
        <textarea id='output_field' style={textareaStyle} value={this.state.content} onChange={this.handleChange.bind(this)} />
      </div>
    )
  }
}
