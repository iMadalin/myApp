'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import SplitPane from 'react-split-pane'
import TabsPane from './TabsPane'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <SplitPane
          split='vertical'
          minSize={200}
          defaultSize={400}>
          <div/>
          <SplitPane
            split='horizontal'
            minSize={300}
            defaultSize={400}>
            <TabsPane />
            <div style={{height: 400}}>
            </div>
          </SplitPane>
        </SplitPane>
      </div>
    )
  }
}
