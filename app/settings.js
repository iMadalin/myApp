'use strict'

import React from 'react'
import { ipcRenderer } from 'electron'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import Select from 'react-select'
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { AwesomeButton } from 'react-awesome-button'
import localStorage from 'localStorage'

const modeOptions =
  [
    { label: 'xml', value: 'xml' },
    { label: 'javascript', value: 'javascript' },
    { label: 'C/C++', value: 'c_cpp' },
    { label: 'python', value: 'python' },
    { label: 'haskell', value: 'haskell' },
    { label: 'java', value: 'java' },
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
    { label: 'dracula', value: 'dracula' },
    { label: 'github', value: 'github' },
    { label: 'tomorrow', value: 'tomorrow' },
    { label: 'kuroir', value: 'kuroir' },
    { label: 'twilight', value: 'twilight' },
    { label: 'xcode', value: 'xcode' },
    { label: 'textmate', value: 'textmate' },
    { label: 'solarized dark', value: 'solarized_dark' },
    { label: 'solarized light', value: 'solarized_light' },
    { label: 'terminal', value: 'terminal' },
  ]

const fontSizeOptions =
  [
    { label: '8', value: '8pt' },
    { label: '9', value: '9pt' },
    { label: '10', value: '10pt' },
    { label: '11', value: '11pt' },
    { label: '12', value: '12pt' },
    { label: '14', value: '14pt' },
    { label: '16', value: '15pt' },
    { label: '18', value: '18pt' },
    { label: '20', value: '20pt' },
    { label: '22', value: '22pt' },
    { label: '24', value: '24pt' },
    { label: '28', value: '28pt' },
    { label: '36', value: '28pt' },
    { label: '48', value: '36pt' },
    { label: '72', value: '72pt' },
  ]

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      displayTextColorColorPicker: false,
      background: JSON.parse(localStorage.getItem('background')),
      textColor: JSON.parse(localStorage.getItem('textColor')),
      theme: JSON.parse(localStorage.getItem('theme')),
      mode: JSON.parse(localStorage.getItem('mode')),
      workingDir: JSON.parse(localStorage.getItem('childStateWorkDir')),
      refUnitPath: JSON.parse(localStorage.getItem('childStateRefUnit')),
      fontSize: JSON.parse(localStorage.getItem('fondSize')),
      basicAutocomplete: JSON.parse(localStorage.getItem('basicAutocomplete')),
      liveAutocomplete: JSON.parse(localStorage.getItem('liveAutocomplete', true)),
      gutter: JSON.parse(localStorage.getItem('gutter', true)),
      printMargin: JSON.parse(localStorage.getItem('printMargin', true)),
      activeLine: JSON.parse(localStorage.getItem('activeLine', true)),
      snippets: JSON.parse(localStorage.getItem('snippets', true)),
      lineNumber: JSON.parse(localStorage.getItem('lineNumber', true)),
      softTabs: JSON.parse(localStorage.getItem('softTabs', true)),

    }
    this.onClickOkButton = this.onClickOkButton.bind(this)
    this.onClickCloseButton = this.onClickCloseButton.bind(this)
    this.onClickWorkDirBrowseButton = this.onClickWorkDirBrowseButton.bind(this)
    this.onClickRefUnitBrowseButtonFromMain = this.onClickRefUnitBrowseButtonFromMain.bind(this)
    this.updateWorkDirInputValue = this.updateWorkDirInputValue.bind(this)
    this.updateRefUnitInputValueFromMain = this.updateRefUnitInputValueFromMain.bind(this)
    this.handleBasicAutocomplete = this.handleBasicAutocomplete.bind(this)
    this.handleLiveAutocomplete = this.handleLiveAutocomplete.bind(this)
    this.handleGutter = this.handleGutter.bind(this)
    this.handlePrintMargin = this.handlePrintMargin.bind(this)
    this.handleActiveLine = this.handleActiveLine.bind(this)
    this.handleSnippets = this.handleSnippets.bind(this)
    this.handleLineNumber = this.handleLineNumber.bind(this)
    this.handleSoftTabs = this.handleSoftTabs.bind(this)
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ background: color.hex })
    localStorage.setItem('background', JSON.stringify(color.hex))

  };

  handleTextColorClick = () => {
    this.setState({ displayTextColorColorPicker: !this.state.displayTextColorColorPicker })
  };

  handleTextColorClose = () => {
    this.setState({ displayTextColorColorPicker: false })
  };

  handleTextColorChange = (color) => {
    this.setState({ textColor: color.hex })
    localStorage.setItem('textColor', JSON.stringify(color.hex))
  };

  handleThemeChange = (value) => {
    this.setState({ theme: value });
    console.log(value)
    localStorage.setItem('theme', JSON.stringify(value))
  }

  handleFondSizeChange = (value) => {
    this.setState({ fontSize: value });
    localStorage.setItem('fondSize', JSON.stringify(value))
  }

  handleModeChange = (value) => {
    this.setState({ mode: value });
    localStorage.setItem('mode', JSON.stringify(value))
  }

  handleBasicAutocomplete(event) {
    this.setState({ basicAutocomplete: event.target.checked });
    localStorage.setItem('basicAutocomplete', JSON.stringify(event.target.checked))
  }

  handleLiveAutocomplete(event) {
    this.setState({ liveAutocomplete: event.target.checked });
    localStorage.setItem('liveAutocomplete', JSON.stringify(event.target.checked))
  }

  handleGutter(event) {
    this.setState({ gutter: event.target.checked });
    localStorage.setItem('gutter', JSON.stringify(event.target.checked))
  }

  handlePrintMargin(event) {
    this.setState({ printMargin: event.target.checked });
    localStorage.setItem('printMargin', JSON.stringify(event.target.checked))
  }

  handleActiveLine(event) {
    this.setState({ activeLine: event.target.checked });
    localStorage.setItem('activeLine', JSON.stringify(event.target.checked))
  }

  handleSnippets(event) {
    this.setState({ snippets: event.target.checked });
    localStorage.setItem('snippets', JSON.stringify(event.target.checked))
  }

  handleLineNumber(event) {
    this.setState({ lineNumber: event.target.checked });
    localStorage.setItem('lineNumber', JSON.stringify(event.target.checked))
  }

  handleSoftTabs(event) {
    this.setState({ softTabs: event.target.checked });
    localStorage.setItem('softTabs', JSON.stringify(event.target.checked))
  }

  onClickWorkDirBrowseButton() {
    ipcRenderer.send('brosweWorkDirButtonClicked', false)
  }

  onClickRefUnitBrowseButtonFromMain() {
    ipcRenderer.send('brosweRefUnitButtonClicked', false)
  }

  onClickOkButton() {
    ipcRenderer.send('settingPageOkButton',
      this.state.background, this.state.textColor, this.state.fontSize,
      this.state.mode, this.state.theme, this.state.basicAutocomplete,
      this.state.liveAutocomplete, this.state.gutter, this.state.printMargin,
      this.state.activeLine, this.state.snippets, this.state.lineNumber,
      this.state.softTabs, this.state.workingDir, this.state.refUnitPath)
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

  componentDidMount() {
    ipcRenderer.on('selectedWorkDirPathFromMain', (event, result) => {
      this.setState({
        workingDir: result
      })
      document.getElementById("workDirPathFromMain").setAttribute('value', result);
      localStorage.setItem('childStateWorkDir', JSON.stringify(result))
    })
    ipcRenderer.on('selectedRefUnitPathFromMain', (event, result) => {
      this.setState({
        refUnitPath: result
      })
      console.log(result)
      document.getElementById("refUnitPathFromMain").setAttribute('value', result);
      localStorage.setItem('childStateRefUnit', JSON.stringify(result))
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
      fontSize: "12pt"
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
          <div style={styles.swatch} onClick={this.handleTextColorClick}>
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
              fontSize: "12pt"
            }}>Font Size</span>
          </div>
          <div style={{ width: 170 }}>
            <Select
              value={selectedFontSizeOption}
              onChange={this.handleFondSizeChange}
              options={fontSizeOptions}
              color={this.state.textColor}
              defaultValue={this.state.fontSize}
            />

          </div>
          <div style={{ float: 'left' }}>
            <span style={{
              color: this.state.textColor, padding: 10,
              fontSize: "12pt"
            }}>Language</span>
          </div>
          <div style={{ width: 300 }}>
            <Select
              value={selectedModeOption}
              onChange={this.handleModeChange}
              options={modeOptions}
              defaultValue={this.state.mode}
            />
          </div>

          <div style={{ float: 'left' }}>
            <span style={{
              color: this.state.textColor, padding: 20,
              fontSize: "12pt"
            }}>Theme</span>
          </div>
          <div style={{ width: 300 }}>
            <Select
              value={selectedThemeOption}
              onChange={this.handleThemeChange}
              options={themeOptions}
              color={this.state.textColor}
              defaultValue={this.state.theme}
            />
          </div>

          <label>
            <Toggle
              defaultChecked={this.state.basicAutocomplete}
              onChange={this.handleBasicAutocomplete} />
            <span style={labelStyle}>Enable Basic Autocomplete</span>
          </label>
          <label style={{ marginLeft: 180 }}>
            <Toggle
              defaultChecked={this.state.liveAutocomplete}
              onChange={this.handleLiveAutocomplete} />
            <span style={labelStyle}>Enable Live Autocomplete</span>
          </label>
          <br></br>
          <label>
            <Toggle
              defaultChecked={this.state.gutter}
              onChange={this.handleGutter} />
            <span style={labelStyle}>Show Gutter</span>
          </label>
          <label style={{ marginLeft: 278 }}>
            <Toggle
              defaultChecked={this.state.printMargin}
              onChange={this.handlePrintMargin} />
            <span style={labelStyle}>Show Print Margin</span>
          </label>
          <br></br>
          <label>
            <Toggle
              defaultChecked={this.state.activeLine}
              onChange={this.handleActiveLine} />
            <span style={labelStyle}>Highlight Active Line</span>
          </label>
          <label style={{ marginLeft: 219 }}>
            <Toggle
              defaultChecked={this.state.snippets}
              onChange={this.handleSnippets} />
            <span style={labelStyle}>Enable Snippets</span>
          </label>
          <br></br>
          <label>
            <Toggle
              defaultChecked={this.state.lineNumber}
              onChange={this.handleLineNumber} />
            <span style={labelStyle}>Show Line Number</span>
          </label >

          <label style={{ marginLeft: 234 }}>
            <Toggle
              defaultChecked={this.state.softTabs}
              onChange={this.handleSoftTabs} />
            <span style={labelStyle}>Use soft tabs</span>
          </label >
        </fieldset>

        <label style={{ color: this.state.textColor, margin: 15 }}>Working Directory: </label>
        <input id="workDirPathFromMain" value={this.state.workingDir} onChange={this.updateWorkDirInputValue} type="text" style={{ width: "500px", height: "30px", fontSize: "12pt", marginRight: 5, marginLeft: 10 }}></input>
        <AwesomeButton size="small" action={(_element, next) => this.onClickWorkDirBrowseButton(next)} > Browse... </AwesomeButton>
        <label style={{ color: this.state.textColor, margin: 15 }}>Reference Unit Path: </label>
        <input id="refUnitPathFromMain" value={this.state.refUnitPath} onChange={this.updateRefUnitInputValueFromMain} style={{ width: "500px", height: "30px", fontSize: "12pt", marginRight: 5 }}></input>
        <AwesomeButton size="small" action={(_element, next) => this.onClickRefUnitBrowseButtonFromMain(next)} > Browse... </AwesomeButton>

        <AwesomeButton size="small" style={{ position: 'auto', left: 560, bottom: 20, marginTop: 40 }} action={(_element, next) => this.onClickOkButton(next)} > OK </AwesomeButton>
        <AwesomeButton size="small" style={{ position: 'auto', left: 580, bottom: 20, marginTop: 40 }} action={(_element, next) => this.onClickCloseButton(next)} > Close </AwesomeButton>
      </div>
    )
  }
}
