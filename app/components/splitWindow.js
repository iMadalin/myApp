import React, { Component } from 'react';
import { render } from 'react-dom';
import SplitPane from './SplitPane';



const SplitWindow = () => {
    const styleA = { background: '#eee' };
    const styleB = { background: '#aaa4ba' };
    const styleC = { background: '#000' };
    const styleD = { background: '#ccc' };

    return (
      <SplitPane
           split="vertical"
           minSize={300} maxSize={300}
           className="primary"
           pane1Style={styleA}
           resizerStyle={styleC}>
           <div>...</div>
           <SplitPane split="horizontal" paneStyle={styleD} pane2Style={styleB}>
                <div>
                 <textarea id="mytextarea">some text</textarea>
                </div>
               <div> ...world.</div>

           </SplitPane>
       </SplitPane>
    );
};



if (document.getElementById('SplitWindow')) render(<SplitWindow />, document.getElementById('SplitWindow'));
