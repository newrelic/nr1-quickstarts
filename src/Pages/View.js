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
            'quickstart': data.quickstarts.find(element => element.id === props.match.params.handle),
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
        console.log(file);
        this.getAccountId(() => {
            fetch('./data/' + file).then(response => response.json()).then((json) => {
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
                            <h2>{ this.state.quickstart.name }</h2>
                        </div>
                        <div className="col-4 text-right">
                            <Link className="btn btn-default" to={"/"}>
                                Back to homepage
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8">
                            <p><b>Created by:</b> { this.state.quickstart.authors.join(', ') }</p>
                            <Datasource sources={this.state.quickstart.sources} />
                            <h5 className="pt-4">Installation instructions</h5>
                            <p>This dashboard requires the following New Relic products:</p>
                            <InstallationInstructions sources={this.state.quickstart.sources} />
                        </div>
                        <div className="col-4 text-right">
                            <a className="btn btn-danger" href={"https://github.com/newrelic-experimental/quickstarts/issues/new?labels=bug&title=Problem%20with%20" + this.state.quickstart.id}>Report a problem</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h2>Dashboards</h2>

                            {this.state.quickstart.dashboards.map((dashboard) => {
                                return (
                                    <div key={dashboard.filename} className="row px-4 py-2">
                                        <div className="col-8">
                                            <h3>{dashboard.name}</h3>
                                        </div>
                                        <div className="col-4 py-3 text-right">
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                {/* <button className="btn btn-primary">Import to New Relic (TODO)</button> */}
                                                <button className="btn btn-outline-info" onClick={(event) => { this.copy('./' + this.state.quickstart.id + '/dashboards/' + dashboard.filename) }}>Copy dashboard JSON to clipboard</button>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            {dashboard.screenshots.map((screenshot) => {
                                                return (
                                                    <img key={screenshot} src={ "data/" + this.state.quickstart.id + "/dashboards/" + screenshot} className="card-img-top" alt="..." />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {this.state.modalVisible&&
                    <div className="modal fade show" tabIndex="-1" role="dialog" style={{"display": "block", "backgroundColor": "rgba(150, 150, 150, 0.50)"}}>
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
