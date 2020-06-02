import React from 'react';
import Datasource from '../Partials/Datasource';
import ExportTerraform from '../Partials/ExportTerraform';
import InstallationInstructions from '../Partials/InstallationInstructions';
import {
    Link
  } from "react-router-dom";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faHome, faFileExport } from '@fortawesome/free-solid-svg-icons';
import data from '../data.json';

class View extends React.Component {

    modalCallback = undefined;

    constructor(props) {
        super(props);

        this.state = {
            quickstart: data.quickstarts.find(element => element.id === props.match.params.handle),
            visible: 0,
            accountModalVisible: false,
            terraformModalVisible: false,
            accountId: '',
        };

        this.copy = this.copy.bind(this);
        this.setAccountId = this.setAccountId.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showTerraform = this.showTerraform.bind(this);
    }

    getAccountId(callback) {
        this.modalCallback = callback;
        this.setState({
            accountModalVisible: true,
        });
    }

    submitModal() {
        this.setState({
            accountModalVisible: false,
        });
        if (this.modalCallback) {
            this.modalCallback();
        }
    }

    closeModal() {
        this.setState({
            accountModalVisible: false,
            terraformModalVisible: false,
        });
    }

    setAccountId(event) {
        this.setState({
            'accountId': event.target.value,
        });
    }

    getDashboard(file, callback) {
        this.getAccountId(() => {
            this.getFile(file).then((json) => {
                json.dashboard_account_id = +this.state.accountId;
                callback(JSON.stringify(json));
            });
        });
    }

    getFile(file) {
        return fetch('./data/' + file).then(response => response.json());
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

    showTerraform(file) {
        console.log(file);
        this.getFile(file).then((json) => {
            this.setState({
                terraformModalVisible: true,
                dashboardJson: json,
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
                                <FontAwesomeIcon icon={faHome} /> Back to homepage
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-12">
                            <div className="card">
                                <div className="card-header">
                                    Description
                                </div>
                                <div className="card-body">
                                    <div class="row">
                                        <div className="col-8">
                                            <h5>Installation instructions</h5>
                                            <p>This dashboard requires the following New Relic products:</p>
                                            <InstallationInstructions sources={this.state.quickstart.sources} />

                                            <p><b>Data sources: <Datasource sources={this.state.quickstart.sources} /></b></p>

                                            {this.state.quickstart.authors.length > 0 &&
                                                <p><b>Created by:</b> { this.state.quickstart.authors.join(', ') }</p>
                                            }
                                        </div>
                                        <div className="col-4 text-right">
                                            <a className="btn btn-danger" href={"https://github.com/newrelic-experimental/quickstarts/issues/new?labels=bug&title=Problem%20with%20" + this.state.quickstart.id}><FontAwesomeIcon icon={faBug} /> Report a problem</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    Dashboards
                                </div>
                                <div className="card-body">
                                    {this.state.quickstart.dashboards.map((dashboard) => {
                                        return (
                                            <div key={dashboard.filename} className="row px-4 py-4">
                                                <div className="col-8 py-1">
                                                    <h3>{dashboard.name}</h3>
                                                </div>
                                                <div className="col-4 text-right">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="default" id="dropdown-basic">
                                                            <FontAwesomeIcon icon={faFileExport} /> Import dashboard
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={(event) => { this.copy('./' + this.state.quickstart.id + '/dashboards/' + dashboard.filename) }}>Copy JSON to clipboard</Dropdown.Item>
                                                            <Dropdown.Item onClick={(event) => { this.showTerraform('./' + this.state.quickstart.id + '/dashboards/' + dashboard.filename) }}>Generate Terraform template</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
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
                    </div>
                </div>

                <Modal show={this.state.accountModalVisible} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Enter your New Relic account ID</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>You can find your account ID in New Relic UI:</p>
                        <input type="text" className="form-control" id="accountId" aria-describedby="Account Id" placeholder="" value={this.state.accountId} onChange={this.setAccountId} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.submitModal}>Set</Button>
                        <Button variant="secondary" onClick={this.closeModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.terraformModalVisible} size="lg" onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Terraform export</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ExportTerraform json={this.state.dashboardJson} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.closeModal}>Close modal</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default View;
