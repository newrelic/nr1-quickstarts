import React from 'react';
import Datasource from '../Partials/Datasource';
import InstallationInstructions from '../Partials/InstallationInstructions';
import {
    Link
  } from "react-router-dom";
import data from '../data.json';

class View extends React.Component {

    modalCallback = undefined;

    constructor(props) {
        super(props);

        this.state = {
            'dashboard': data.dashboards.find(element => element.name === props.match.params.handle),
            'visible': 0,
            'modalVisible': false,
            'accountId': '',
        };

        this.copy = this.copy.bind(this);
        this.setAccountId = this.setAccountId.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    getAccountId(callback) {
        this.modalCallback = callback;
        this.setState({
            'modalVisible': true,
        });
    }

    submitModal() {
        this.setState({
            'modalVisible': false,
        });
        if (this.modalCallback) {
            this.modalCallback();
        }
    }

    closeModal() {
        this.setState({
            'modalVisible': false,
        });
    }

    setAccountId(event) {
        this.setState({
            'accountId': event.target.value,
        });
    }

    getDashboard(file, callback) {
        this.getAccountId(() => {
            fetch('./data/' + file.location).then(response => response.json()).then((json) => {
                json.dashboard_account_id = +this.state.accountId;
                callback(JSON.stringify(json));
            });
        });
    }

    copy(file) {
        this.getDashboard(file, (text) => {
            navigator.permissions.query({name: "clipboard-write"}).then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.clipboard.writeText(text).then(function() {
                        alert('Dashboard copied to clipboard');
                    }, function(error) {
                        console.log('error', error);
                        alert('Failed to copy dashboard to clipboard');
                    });
                }
            });
        });
    }

    render() {
        return (
            <div className="album py-2">
                <div className="container" id="root">
                    <div className="row py-4">
                        <div className="col-8">
                            <h2>{ this.state.dashboard.config.name }</h2>
                        </div>
                        <div className="col-4 text-right">
                            <Link className="btn btn-default" to={"/"}>
                                Back to homepage
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <p><b>Created by:</b> { this.state.dashboard.config.author }</p>
                            <Datasource sources={this.state.dashboard.sources} />
                            <h5 className="pt-4">Installation instructions</h5>
                            <p>This dashboard requires the following New Relic products:</p>
                            <InstallationInstructions sources={this.state.dashboard.sources} />
                        </div>
                        <div className="col-4 text-right">
                            <a class="btn btn-danger" href={"https://github.com/newrelic-experimental/quickstarts/issues/new?labels=bug&title=Problem%20with%20" + this.state.dashboard.config.name}>Report a problem</a>
                        </div>
                    </div>
                    <div className="row py-4">
                        <h3>Dashboards</h3>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <ul className="nav nav-tabs">
                                {this.state.dashboard.files.map((file, i) => {
                                    let selected = '';
                                    if (this.state.visible === i) selected = 'active';
                                    return (
                                        <li className="nav-item" key={file.name}>
                                            <button className={"nav-link btn " + selected} onClick={(event) => { this.setState({visible: i}) }}>
                                                {file.name}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        {this.state.dashboard.files.map((file, i) => {
                            if (this.state.visible !== i) return ( <span key={file.name}></span> );
                            return (
                                <div className="row px-4 py-2 dashboard-info bg-light" key={file.name}>
                                    <div className="col-12 py-3 text-right">
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button className="btn btn-primary">Import to New Relic (TODO)</button>
                                            <button className="btn btn-info" onClick={(event) => { this.copy(file) }}>Copy to clipboard</button>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <img src={ "data/" + this.state.dashboard.name + "/" + this.state.dashboard.screenshots[i]} className="card-img-top" alt="..." />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="row py-4">
                        <div className="col-12">
                            <h3>Alerts</h3>
                        </div>
                        <div className="col-12">
                            <p>Work in progress: Example alerts the customer could set-up</p>
                        </div>
                    </div>
                </div>

                {this.state.modalVisible&&
                    <div className="modal fade show" tabIndex="-1" role="dialog" style={{"display": "block", "background-color": "rgba(150, 150, 150, 0.50)"}}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Choose your New Relic account ID</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>You can find your account ID in New Relic UI:</p>
                                    <input type="text" className="form-control" id="accountId" aria-describedby="Account Id" placeholder="" value={this.state.accountId} onChange={this.setAccountId} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={this.submitModal}>Set</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.closeModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default View;
