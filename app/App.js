'use strict'

import React from 'react'
import SplitPane from 'react-split-pane'
import TabsPane from './TabsPane'
import Validate from './validate'
import Solve from './solve'
import Cons from './Console'


export default class App extends React.Component {
  render () {
    return (
      <div>
        <SplitPane
          split='vertical'
          minSize={200}
          defaultSize={200}>
          <div>
            <a>
            <Validate/>
            <Solve/>
            </a>
          </div>
          <SplitPane
            split='horizontal'
            minSize={200}
            defaultSize={500}
            >
            <TabsPane />
            <div style = {{height: '100%'}}>
            <Cons/>
            </div>
          </SplitPane>
        </SplitPane>
      </div>
    )
  }
}
