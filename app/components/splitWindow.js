import React, { Component } from 'react';
import { render } from 'react-dom';
import SplitPane from './SplitPane';
import OpenFileButton from './OpenFileButton'
import TextArea from "./Textarea"




const SplitWindow = () => {
  const styleA = { background: '#eee' };
  const styleB = { background: 'black' };
  const styleC = { background: '#606080' };
  const styleD = { background: 'black' };
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
                    pane2Style={styleD}>
              <div>
              <OpenFileButton></OpenFileButton>
              <TextArea></TextArea>
              </div>
              <div></div>
          </SplitPane>
      </SplitPane>
  );
  };



if (document.getElementById('SplitWindow')) render(<SplitWindow />, document.getElementById('SplitWindow'));
