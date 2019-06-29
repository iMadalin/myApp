'use strict'

import React from 'react'
import { ipcRenderer } from 'electron'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import Select from 'react-select'
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { AwesomeButton } from 'react-awesome-button'

const modeOptions =
[
  { label: 'xml', value: 'xml' },
  { label: 'javascript', value: 'javascript' },
  { label: 'java', value: 'java' },
  { label: 'python', value: 'python' },
  { label: 'ruby', value: 'ruby' },
  { label: 'markdown', value: 'markdown' },
  { label: 'mysql', value: 'mysql' },
  { label: 'json', value: 'json' },
  { label: 'html', value: 'html' },
  { label: 'handlebars', value: 'handlebars' },
  { label: 'golang', value: 'golang' },
  { label: 'csharp', value: 'csharp' },
  { label: 'coffee', value: 'coffee' },
  { label: 'css', value: 'css' },
]

const themeOptions =
[
  { label: 'monokai', value: 'monokai' },
  { label: 'github', value: 'github' },
  { label: 'tomorrow', value: 'tomorrow' },
  { label: 'kuroir', value: 'kuroir' },
  { label: 'twilight', value: 'twilight' },
  { label: 'xcode', value: 'xcode' },
  { label: 'textmate', value: 'textmate' },
  { label: 'solarized dark', value: 'solarized dark' },
  { label: 'solarized light', value: 'solarized light' },
  { label: 'terminal', value: 'terminal' },
]

const fontSizeOptions =
[
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '15' },
  { label: '18', value: '18' },
  { label: '20', value: '20' },
  { label: '22', value: '22' },
  { label: '24', value: '24' },
  { label: '28', value: '28' },
  { label: '36', value: '28' },
  { label: '48', value: '36' },
  { label: '72', value: '72' },
]

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      displayTextColorColorPicker: false,
      background: '#373a47',
      textColor: '#CE9D30',
      theme: JSON.parse(localStorage.getItem('theme' || { label: 'monokai', value: 'monokai' })),
      mode: { label: 'xml', value: 'xml' },
      workingDir: JSON.parse(localStorage.getItem('childStateWorkDir' || '')),
      refUnitPath: JSON.parse(localStorage.getItem('childStateRefUnit' || '')),
      fontSize: { label: '14', value: '14' },
    }
    this.onClickOkButton = this.onClickOkButton.bind(this)
    this.onClickCloseButton = this.onClickCloseButton.bind(this)
    this.onClickWorkDirBrowseButton = this.onClickWorkDirBrowseButton.bind(this)
    this.onClickRefUnitBrowseButtonFromMain = this.onClickRefUnitBrowseButtonFromMain.bind(this)
    this.updateWorkDirInputValue = this.updateWorkDirInputValue.bind(this)
    this.updateRefUnitInputValueFromMain = this.updateRefUnitInputValueFromMain.bind(this)
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ background: color.hex })
  };

  handleTextColorClick = () => {
    this.setState({ displayTextColorColorPicker: !this.state.displayTextColorColorPicker })
  };

  handleTextColorClose = () => {
    this.setState({ displayTextColorColorPicker: false })
  };

  handleTextColorChange = (color) => {
    this.setState({ textColor: color.hex })
  };

  handleThemeChange = (value) => {
    this.setState({ theme: value });
    localStorage.setItem('theme', JSON.stringify(this.state.theme))
  }

  handleModeChange = (value) => {
    this.setState({ mode: value });
  }

  onClickWorkDirBrowseButton() {
    ipcRenderer.send('brosweWorkDirButtonClicked', false)
  }

  onClickRefUnitBrowseButtonFromMain() {
    ipcRenderer.send('brosweRefUnitButtonClicked', false)
  }

  onClickOkButton() {
    ipcRenderer.send('settingPageOkButton', this.state.workingDir, this.state.refUnitPath)
  }

  onClickCloseButton() {
    ipcRenderer.send('settingPageCloseButton', "")
  }

  updateWorkDirInputValue(evt) {
    this.setState({
      workingDir: evt.target.value
    });
  }

  updateRefUnitInputValueFromMain(evt) {
    this.setState({
      refUnitPath: evt.target.value
    });
  }

  componentDidMount(){
    ipcRenderer.on('selectedWorkDirPath',(event, result) => {
      this.setState({
        workingDir: result
      })
      document.getElementById("workDirPathFromMain").setAttribute('value', result);
      localStorage.setItem('childStateWorkDir', JSON.stringify(this.state.workingDir))
    })
    ipcRenderer.on('selectedRefUnitPathFrmoMain',(event, result) => {
      this.setState({
        refUnitPath: result
      })
      document.getElementById("refUnitPathFromMain").setAttribute('value', result);
      localStorage.setItem('childStateRefUnit', JSON.stringify(this.state.refUnitPath))
    })
  }

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '0px',
          background: this.state.background,
        },
        color1: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.textColor,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.11)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    let style = {
      background: this.state.background,
      position: 'relative'
    }
    let labelStyle = {
      color: this.state.textColor,
      padding: 10,
      fontSize: this.state.fontSize
    }

    const { selectedThemeOption } = this.state.theme;
    const { selectedModeOption } = this.state.mode;
    const { selectedFontSizeOption } = this.state.fontSize;

    return (
      <div style={style}>

        <div style={{ padding: 15 }}>
          <label style={labelStyle}>Background Color</label>
          <div style={styles.swatch} onClick={this.handleClick}>
            <div style={styles.color} />
          </div>
          {this.state.displayColorPicker ? <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SketchPicker color={this.state.background} onChange={this.handleChange} />
          </div> : null}
        </div>

        <div style={{ padding: 15 }}>
          <label style={labelStyle}>Text Color</label>
          <div style={styles.swatch } onClick={this.handleTextColorClick}>
            <div style={styles.color1} />
          </div>
          {this.state.displayTextColorColorPicker ? <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleTextColorClose} />
            <SketchPicker color={this.state.textColor} onChange={this.handleTextColorChange} />
          </div> : null}
        </div>
        <fieldset style={{ margin: 5 }}>
          <legend style={labelStyle}>Editor Settings</legend>

          <div style={{ float: 'left' }}>
            <span style={{
             color: this.state.textColor, padding: 11,
              fontSize: 18
            }}>Font Size</span>
          </div>
          <div style={{ width: 170 }}>
            <Select
              value={selectedFontSizeOption}
              onChange={this.handleThemeChange}
              options={fontSizeOptions}
              color={this.state.textColor}
              defaultValue= {this.state.fontSize}
            />

          </div>
          <div style={{ float: 'left' }}>
            <span style={{
              color: this.state.textColor, padding: 10,
              fontSize: 18
            }}>Language</span>
          </div>
          <div style={{ width: 300 }}>
            <Select
              value={selectedModeOption}
              onChange={this.handleModeChange}
              options={modeOptions}
              defaultValue= {this.state.mode}
            />
          </div>

          <div style={{ float: 'left' }}>
            <span style={{
              color: this.state.textColor, padding: 20, 
              fontSize: 18
            }}>Theme</span>
          </div>
          <div style={{ width: 300 }}>
            <Select
              value={selectedThemeOption}
              onChange={this.handleThemeChange}
              options={themeOptions}
              color={this.state.textColor}
              defaultValue= {this.state.theme}
            />
          </div>

          <label>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Enable Basic Autocomplete</span>
          </label>
          <label style={{ marginLeft: 180 }}>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Enable Live Autocomplete</span>
          </label>
          <br></br>
          <label>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Show Gutter</span>
          </label>
          <label style={{ marginLeft: 278 }}>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Show Print Margin</span>
          </label>
          <br></br>
          <label>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Highlight Active Line</span>
          </label>
          <label style={{ marginLeft: 219 }}>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Enable Snippets</span>
          </label>
          <br></br>
          <label>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Show Line Number</span>
          </label >

          <label style={{ marginLeft: 234}}>
            <Toggle
              defaultChecked={this.state.baconIsReady}
              onChange={this.handleBaconChange} />
            <span style={labelStyle}>Use soft tabs</span>
          </label >
        </fieldset>

        <label style={{ color: "#ffb90f", margin: 15 }}>Working Directory: </label>
        <input id="workDirPathFromMain" value={this.state.workingDir} onChange={this.updateWorkDirInputValue} type="text" style={{ width: "500px", height: "30px", fontSize: "12pt", marginRight: 5, marginLeft: 10 }}></input>
        <AwesomeButton size="small" action={(_element, next) => this.onClickWorkDirBrowseButton(next)} > Browse... </AwesomeButton>
        <label style={{ color: "#ffb90f", margin: 15  }}>Reference Unit Path: </label>
        <input id="refUnitPathFromMain" value={this.state.refUnitPath} onChange={this.updateRefUnitInputValueFromMain} style={{ width: "500px", height: "30px", fontSize: "12pt", marginRight: 5 }}></input>
        <AwesomeButton size="small" action={(_element, next) => this.onClickRefUnitBrowseButtonFromMain(next)} > Browse... </AwesomeButton>

        <AwesomeButton size="small" style={{ position: 'auto', left: 560, marginTop:40}} action={(_element, next) => this.onClickOkButton(next)} > OK </AwesomeButton>
        <AwesomeButton size="small" style={{ position: 'auto', left: 580, marginTop:40 }} action={(_element, next) => this.onClickCloseButton(next)} > Close </AwesomeButton>
      </div>
    )
  }
}
