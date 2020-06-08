import React from 'react';
import {
    Switch,
    Route,
    HashRouter
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import ToolsTerraform from './Pages/ToolsTerraform';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';

class App extends React.Component {

    render() {
        return (
            <HashRouter>

                <div className="container">
                    <header>

                        <Navbar bg="light" expand="lg">
                            <LinkContainer to={"/"}>
                                <Navbar.Brand to={"/"}>New Relic Quickstarts</Navbar.Brand>
                            </LinkContainer>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />

                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    <LinkContainer to={"/"}>
                                        <Nav.Link>Home</Nav.Link>
                                    </LinkContainer>
                                    <NavDropdown title="Tools" id="basic-nav-dropdown">
                                        <LinkContainer to={"/tools/terraform"}>
                                            <NavDropdown.Item>Terraform converter</NavDropdown.Item>
                                        </LinkContainer>
                                    </NavDropdown>
                                </Nav>
                                <div className="my-2 my-lg-0">
                                    <a href="https://github.com/newrelic-experimental/quickstarts" target="_BLANK" rel="noopener noreferrer" className="btn btn-light"><FontAwesomeIcon icon={faGithub} /> Go to Github repository</a>
                                </div>
                            </Navbar.Collapse>
                        </Navbar>

                    </header>
                </div>

                <main role="main">

                    <Switch>
                        <Route path="/tools/terraform" component={ToolsTerraform} />
                        <Route path="/view/:handle" component={View} />
                        <Route path="/" component={Home} />
                    </Switch>

                </main>

            </HashRouter>
        )
    }

}

export default App;
