import React from 'react';
import data from "./../../../../src/data.json";
import ViewOverview from './ViewOverview';
import {
    Link,
    Switch,
    Route
  } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faHome } from '@fortawesome/free-solid-svg-icons';
import ViewDashboard from './ViewDashboards';
import ViewRequirements from './ViewRequirements';

class View extends React.Component {

    modalCallback = undefined;

    constructor(props) {
        super(props);

        this.state = View.getState(props);
    }

    static getState(props) {
        return {
            quickstart: data.quickstarts.find(element => element.id === props.match.params.handle),
            path: props.match.path,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.quickstart || (state.quickstart.id !== props.match.params.handle)) {
            return View.getState(props);
        }
        return null
    }

    render() {
        if (!this.state.quickstart) {
            return (
                <div className="container" id="root">
                    <div className="album py-2">
                        <div className="container" id="root">
                            <div className="row py-4">
                                <div className="col-8">
                                    <h2>Quickstart not found</h2>
                                </div>
                                <div className="col-4 text-right">
                                    <Link className="btn btn-default" to={"/"}>
                                        <FontAwesomeIcon icon={faHome} /> Back to listing
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="container" id="root">
                <div className="row header">
                    <div className="col-8">
                        <h2>{ this.state.quickstart.name }</h2>
                    </div>
                    <div className="col-4 text-right">
                        <Link className="btn btn-default" to={"/"}>
                            <FontAwesomeIcon icon={faHome} /> Back to listing
                        </Link>
                    </div>
                </div>
                <div className="row pt-4">
                    <div className="col-3 sidebar">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/view/" + this.state.quickstart.id}>
                                    Description
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/view/" + this.state.quickstart.id + "/requirements"}>
                                    Requirements
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/view/" + this.state.quickstart.id + "/dashboards"}>
                                    Dashboards
                                </Link>
                            </li>
                            <li className="nav-divider"></li>
                            <li className="nav-item">
                                <a className="nav-link text-danger" href={"https://github.com/newrelic-experimental/quickstarts/issues/new?labels=bug&title=Problem%20with%20" + this.state.quickstart.id}><FontAwesomeIcon icon={faBug} /> Report a problem</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-9 pl-4">
                        <Switch>
                            <Route exact path={this.state.path}>
                                <ViewOverview quickstart={this.state.quickstart} />
                            </Route>

                            <Route path={`${this.state.path}/dashboards`}>
                                <ViewDashboard quickstart={this.state.quickstart} />
                            </Route>

                            <Route path={`${this.state.path}/requirements`}>
                                <ViewRequirements quickstart={this.state.quickstart} />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default View;
