import React from 'react';
import {
    Switch,
    Route,
    HashRouter,
    Link
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

class App extends React.Component {

    render() {
        return (
            <HashRouter>

                <header>
                    <div className="navbar navbar-dark bg-dark shadow-sm">
                        <div className="container d-flex justify-content-between">
                            <Link className="navbar-brand d-flex align-items-center" to={"/"}>
                                <strong>New Relic Quickstarts</strong>
                            </Link>

                            <a href="https://github.com/newrelic-experimental/quickstarts" target="_BLANK" rel="noopener noreferrer" className="btn btn-light"><FontAwesomeIcon icon={faGithub} /> Go to Github repository</a>
                    </div>
                </div>
                </header>

                <main role="main">

                    <Switch>
                        <Route path="/view/:handle" component={View} />
                        <Route path="/" component={Home} />
                    </Switch>

                </main>

            </HashRouter>
        )
    }

}

export default App;
