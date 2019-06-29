import React from 'react';
import DropdownMenu, { NestedDropdownMenu } from 'react-dd-menu';
import { AwesomeButton } from 'react-awesome-button'
import { ipcRenderer } from 'electron'
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
        this.InsertElement = this.InsertElement.bind(this)
 
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

    InsertElement(path) {
        ipcRenderer.send('insertNewElement', path)
    }

    componentDidMount() {
        ipcRenderer.on('putIcon', this.navClose.bind(this))
        ipcRenderer.on('putString', this.navOpen.bind(this))
    }

    render() {

        const divStyle = {
            margin: 18,

        }

        const menuStyle = {
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

        const sensorNestedProps = {
            toggle: <a style={menuStyle} > Sensor... </a>,
            animate: true,
            inverse: false,
            delay: 0
        };

        const loadNestedProps = {
            toggle: <a style={menuStyle} > Load... </a>,
            animate: true,
            inverse: false,
            delay: 0
        };

        const vehicleNestedProps = {
            toggle: <a style={menuStyle} > Vehicle Component... </a>,
            animate: true,
            inverse: false,
            delay: 0
        };

        const controlNestedProps = {
            toggle: <a style={menuStyle} > Control... </a>,
            animate: true,
            inverse: false,
            delay: 0
        };

        return (
            <div style={divStyle}>
                <DropdownMenu {...menuOptions}>
                    <li><button onClick={() => { this.InsertElement('./lib/Simulation.xml') }} style={menuStyle} > Simulation </button></li>
                    <li><button onClick={() => { this.InsertElement('./lib/MotionBody.xml') }} style={menuStyle} > Motion Body </button></li>
                    <NestedDropdownMenu {...jointNestedProps} >
                        <div style={{ overflowY: 'scroll', overflowX: 'hidden', height: '400px', position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement('./lib/Revolute.xml') }} style={menuStyle} > Revolute </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Slider.xml') }} style={menuStyle} > Slider </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Cylindrical.xml') }} style={menuStyle} > Cylindrical </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Screw.xml') }} style={menuStyle} > Screw </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Universal.xml') }} style={menuStyle} > Universal </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Spherical.xml') }} style={menuStyle} > Spherical </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Planar.xml') }} style={menuStyle} > Planar </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Fixed.xml') }} style={menuStyle} > Fixed </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/ConstantVelocity.xml') }} style={menuStyle} > Constant Velocity </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Atpoint.xml') }} style={menuStyle} > Atpoint </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Inline.xml') }} style={menuStyle} > Inline </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Inplane.xml') }} style={menuStyle} > Inplane </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Orientation.xml') }} style={menuStyle} > Orientation </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Parallel.xml') }} style={menuStyle} > Parallel </a></li>
                            <li><a onClick={() => { this.InsertElement('./lib/Perpendicular.xml') }} style={menuStyle} > Perpendicular </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...couplerNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Gear Coupler </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Rack and Pinion </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Cable </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > 2-3 Joint Coupler </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Motion Body Coupler </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...connectorNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Spring </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Damper </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Bushing </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Beam Force </a></li>

                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...contactNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > 3D Contact </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Analytical Contact </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Analytical Contact Property </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Gear </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Gear Contact </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...constraintNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Point on Curve </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Curve on Curve </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Point on Surface </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...vehicleNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Tire </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Road </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Basic Tire Property </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > MF-Tire and MF-Swift Prroperty </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > CDTire Prroperty </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > FTyre Prroperty </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Motorcycle Tire Prroperty </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Non-inherital Tire Prroperty </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <li><a onClick={() => { this.Insert() }} style={menuStyle} > Profile </a></li>
                    <li><a onClick={() => { this.Insert() }} style={menuStyle} > Driver </a></li>
                    <li><a onClick={() => { this.Insert() }} style={menuStyle} > Marker </a></li>
                    <NestedDropdownMenu {...sensorNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Acceleration </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Displacement </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Force </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Velocity </a></li>
                        </div>
                    </NestedDropdownMenu>
                    <NestedDropdownMenu {...loadNestedProps}>
                        <div style={{ position: 'relative' }}>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Scalar Force </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Scalar Torque </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Vector Force </a></li>
                            <li><a onClick={() => { this.InsertElement() }} style={menuStyle} > Vector Torque </a></li>
                        </div>
                    </NestedDropdownMenu>
                    
                    <li><a onClick={() => { this.Insert() }} style={menuStyle} > Discrete Drivetrain </a></li>
                    <li><a onClick={() => { this.Insert('./lib/Solution.xml') }} style={menuStyle} > Solution </a></li>
                </DropdownMenu>
            </div>
        );
    }
}