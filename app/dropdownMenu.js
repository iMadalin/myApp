import React from 'react';
import DropdownMenu, { NestedDropdownMenu } from 'react-dd-menu';
import { AwesomeButton } from 'react-awesome-button'
import {ipcRenderer} from 'electron'
import 'react-dd-menu/dist/react-dd-menu.css'

export default class NavDropdownMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isMenuOpen: false,
            newElement: "Insert New..",
            size: "large"
        };
        this.click = this.click.bind(this);
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.navClose = this.navClose.bind(this)
        this.navOpen = this.navOpen.bind(this)
    }

    toggle() {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    close() {
        this.setState({ isMenuOpen: false });
    }

    click() {
        console.log('You clicked an item');
    }

    navClose() {
        this.setState({
          size: "auto",
          newElement: <img src={'../img/new-48.png'} style={{ position: 'absolute', cursor: 'pointer', top: 2, left: 2 }}></img>,
        })
      }
    
      navOpen() {
        this.setState({
          size: "large",
          newElement: "Insert New...",

        })
      }

      componentDidMount() {
        ipcRenderer.on('putIcon', this.navClose.bind(this)) 
        ipcRenderer.on('putString', this.navOpen.bind(this)) 
      }

    render() {

        const divStyle = {
            margin: 18,

        }

        const menuStyle ={
            color: "#ffb90f",
        }
        

        const menuOptions = {
            isOpen: this.state.isMenuOpen,
            close: this.close,
            toggle: <AwesomeButton size={this.state.size} action={(_element, next) => this.toggle(next)} simple >
                {this.state.newElement} </AwesomeButton>,
            textAlign: 'left',
            align: 'left',
            animate: true,
            inverse: true,
        };
        const jointNestedProps = {
            toggle: <a style={menuStyle} > Joint... </a>,
            animate: true,
            delay: 0
        };

        const couplerNestedProps = {
            toggle: <a style={menuStyle} > Coupler... </a>,
            animate: true,


            inverse: true,

            delay: 0
        };

        const connectorNestedProps = {
            toggle: <a style={menuStyle} > Connector... </a>,
            animate: true,


            inverse: false,

            delay: 0
        };

        const contactNestedProps = {
            toggle: <a style={menuStyle} > Contact... </a>,
            animate: true,


            inverse: false,

            delay: 0
        };

        const constraintNestedProps = {
            toggle: <a style={menuStyle} > Constraint... </a>,
            animate: true,


            inverse: false,

            delay: 0
        };

        const flexibleNestedProps = {
            toggle: <a style={menuStyle} > Flexible Body... </a>,
            animate: true,


            inverse: false,

            delay: 0
        };

        return (
            <div style={divStyle}>
                <DropdownMenu {...menuOptions}>

                    <li><a href="#" style={menuStyle} > Simulation </a></li>
                    <li><a href="#" style={menuStyle} > Motion Body </a></li>
                    <NestedDropdownMenu {...jointNestedProps} >
                        <div style={{ overflowY: 'scroll', overflowX: 'hidden', height: '400px', position: 'relative' }}>
                            <li><a href="#" style={menuStyle} > Revolute </a></li>
                            <li><a href="#" style={menuStyle} > Slider </a></li>
                            <li><a href="#" style={menuStyle} > Cylindrical </a></li>
                            <li><a href="#" style={menuStyle} > Screw </a></li>
                            <li><a href="#" style={menuStyle} > Universal </a></li>
                            <li><a href="#" style={menuStyle} > Spherical </a></li>
                            <li><a href="#" style={menuStyle} > Planar </a></li>
                            <li><a href="#" style={menuStyle} > Fixed </a></li>
                            <li><a href="#" style={menuStyle} > Constant Velocity </a></li>
                            <li><a href="#" style={menuStyle} > Atpoint </a></li>
                            <li><a href="#" style={menuStyle} > Inline </a></li>
                            <li><a href="#" style={menuStyle} > Inplane </a></li>
                            <li><a href="#" style={menuStyle} > Orientation </a></li>
                            <li><a href="#" style={menuStyle} > Parallel </a></li>
                            <li><a href="#" style={menuStyle} > Perpendicular </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...couplerNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a href="#" style={menuStyle} > Gear Coupler </a></li>
                            <li><a href="#" style={menuStyle} > Rack and Pinion </a></li>
                            <li><a href="#" style={menuStyle} > Cable </a></li>
                            <li><a href="#" style={menuStyle} > 2-3 Joint Coupler </a></li>
                            <li><a href="#" style={menuStyle} > Motion Body Coupler </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...connectorNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a href="#" style={menuStyle} > Spring </a></li>
                            <li><a href="#" style={menuStyle} > Damper </a></li>
                            <li><a href="#" style={menuStyle} > Bushing </a></li>
                            <li><a href="#" style={menuStyle} > Beam Force </a></li>

                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...contactNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a href="#" style={menuStyle} > 3D Contact </a></li>
                            <li><a href="#" style={menuStyle} > Analytical Contact </a></li>
                            <li><a href="#" style={menuStyle} > Analytical Contact Property </a></li>
                            <li><a href="#" style={menuStyle} > Gear </a></li>
                            <li><a href="#" style={menuStyle} > Gear Contact </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...constraintNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a href="#" style={menuStyle} > Point on Curve </a></li>
                            <li><a href="#" style={menuStyle} > Curve on Curve </a></li>
                            <li><a href="#" style={menuStyle} > Point on Surface </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...flexibleNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a href="#" style={menuStyle} > Gear Coupler </a></li>
                            <li><a href="#" style={menuStyle} > Rack and Pinion </a></li>
                            <li><a href="#" style={menuStyle} > Cable </a></li>
                            <li><a href="#" style={menuStyle} > 2-3 Joint Coupler </a></li>
                            <li><a href="#" style={menuStyle} > Motion Body Coupler </a></li>
                        </div>
                    </NestedDropdownMenu>

                    <li><a href="#" style={menuStyle} > Profile </a></li>
                    <li><a href="#" style={menuStyle} > Driver </a></li>
                    <li><a href="#" style={menuStyle} > Marker </a></li>

                    <li><a href="#" style={menuStyle} > Discrete Drivetrain </a></li>

                </DropdownMenu>
            </div>
        );
    }
}