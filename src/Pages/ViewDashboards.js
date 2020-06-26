import React from 'react';
import ExportTerraform from '../Partials/ExportTerraform';
import { Dropdown, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

class ViewDashboard extends React.Component {

    modalCallback = undefined;

    constructor(props) {
        super(props);

        this.state = ViewDashboard.getState(props);

        this.copy = this.copy.bind(this);
        this.setAccountId = this.setAccountId.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showTerraform = this.showTerraform.bind(this);
    }

    static getState(props) {
        return {
            quickstart: props.quickstart,
            visible: 0,
            accountModalVisible: false,
            terraformModalVisible: false,
            accountId: '',
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.quickstart || (state.quickstart.id !== props.quickstart.id)) {
            return ViewDashboard.getState(props);
        }
        return null
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
            <div className="dashboards">
                <h3>Dashboards</h3>

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

export default ViewDashboard;
