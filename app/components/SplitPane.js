import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Prefixer from 'inline-style-prefixer';
import stylePropType from 'react-style-proptype';

import Pane from './Pane';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Safari/537.2';



class SplitPane extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            active: false,
            resized: false,
        };
    }

    componentDidMount() {
        this.setSize(this.props, this.state);
      }


    componentWillReceiveProps(props) {
        this.setSize(props, this.state);
    }



    setSize(props, state) {
        const ref = this.props.primary === 'first' ? this.pane1 : this.pane2;
        let newSize;
        if (ref) {
            newSize = props.size || (state && state.draggedSize) || props.defaultSize || props.minSize;
            ref.setState({
                size: newSize,
            });
            if (props.size !== state.draggedSize) {
                this.setState({
                    draggedSize: newSize,
                });
            }
        }
    }

    render() {
        const { split, allowResize } = this.props;
        const disabledClass = allowResize ? '' : 'disabled';

        const style = Object.assign({},
            this.props.style || {}, {
                display: 'flex',
                flex: 1,
                position: 'relative',
                outline: 'none',
                overflow: 'hidden',
                MozUserSelect: 'text',
                WebkitUserSelect: 'text',
                msUserSelect: 'text',
                userSelect: 'text',
            });

        if (split === 'vertical') {
            Object.assign(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0,
            });
        } else {
            Object.assign(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%',
            });
        }

        const children = this.props.children;
        const classes = ['SplitPane', this.props.className, split, disabledClass];

        const pane1Style = this.props.prefixer.prefix(
            Object.assign({},
            this.props.paneStyle || {},
            this.props.pane1Style || {}),
        );

        const pane2Style = this.props.prefixer.prefix(
            Object.assign({},
            this.props.paneStyle || {},
            this.props.pane2Style || {}),
        );

        return (
            <div
                className={classes.join(' ')}
                style={this.props.prefixer.prefix(style)}
                ref={(node) => { this.splitPane = node; }}
            >

                <Pane
                    ref={(node) => { this.pane1 = node; }}
                    key="pane1" className="Pane1"
                    style={pane1Style}
                    split={split}
                    size={this.props.primary === 'first' ?
                      this.props.size || this.props.defaultSize || this.props.minSize :
                      undefined
                    }
                >
                    {children[0]}
                </Pane>

                <Pane
                    ref={(node) => { this.pane2 = node; }}
                    key="pane2"
                    className="Pane2"
                    style={pane2Style}
                    split={split}
                    size={this.props.primary === 'second' ?
                      this.props.size || this.props.defaultSize || this.props.minSize : undefined
                    }
                >
                    {children[1]}
                </Pane>
            </div>
        );
    }
}

SplitPane.propTypes = {
    primary: PropTypes.oneOf(['first', 'second']),
    minSize: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    maxSize: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    // eslint-disable-next-line react/no-unused-prop-types
    defaultSize: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    size: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),

    split: PropTypes.oneOf(['vertical', 'horizontal']),


    onChange: PropTypes.func,
    prefixer: PropTypes.instanceOf(Prefixer).isRequired,
    style: stylePropType,

    paneStyle: stylePropType,
    pane1Style: stylePropType,
    pane2Style: stylePropType,
    className: PropTypes.string,

    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

SplitPane.defaultProps = {
    split: 'vertical',
    minSize: '90%',
    allowResize: false,
    prefixer: new Prefixer({ userAgent: USER_AGENT }),
    primary: 'first',
};

export default SplitPane;
