import React, { Component } from 'react';
import { render } from 'react-dom';
import SplitPane from './SplitPane';
import OpenFile from './OpenFile'
import OpenFileButton from "./OpenFileButton"
import TextArea from "./Textarea"






const SplitWindow = () => {
  const styleA = { background: '#eee' };
  const styleB = { background: 'black' };
  const styleC = { background: '#606080' };
  const styleD = { background: 'black' };
  const divStyle = {
      flex: 1,
      position: 'relative',
      outline: 'none',
      height: '100%',
      width: '100%'
  }

  return (
      <SplitPane
          split="vertical"
          minSize={50} maxSize={300} defaultSize={100}
          className="primary"
          pane1Style={styleA}
          resizerStyle={styleB}>
          <div>

          </div>
          <SplitPane
                    split="horizontal"
                    paneStyle={styleC}
                    pane2Style={styleD}
                    >

              <div style={divStyle} >

                <TextArea ></TextArea>

              </div>
              <div><OpenFileButton/></div>
          </SplitPane>
      </SplitPane>
  );
  };




if (document.getElementById('SplitWindow')) render(<SplitWindow />, document.getElementById('SplitWindow'));
