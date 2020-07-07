import React from 'react';
import {
    Link,
  } from "react-router-dom";
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
                            <div className="col-6 py-1">
                                <h3>{dashboard.name}</h3>
                            </div>
                            <div className="col-6 text-right">
                                { window !== window.top && // Detect if we're in an iframe, if so we assume we're in a Nerdlet
                                    <button type="button" className="btn btn-secondary"><FontAwesomeIcon icon={faFileExport} /> Import into New Relic</button>
                                }
                                { window === window.top &&
                                    <Link className="nav-link" to={"/install-nerdlet"}>
                                        Import into New Relic
                                    </Link>
                                }
                            </div>
                            <div className="col-12">
                                {dashboard.screenshots.map((screenshot) => {
                                    return (
                                        <img key={screenshot} src={ "https://newrelic-experimental.github.io/quickstarts/data/" + this.state.quickstart.id + "/dashboards/" + screenshot} className="card-img-top" alt="..." />
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default ViewDashboard;
