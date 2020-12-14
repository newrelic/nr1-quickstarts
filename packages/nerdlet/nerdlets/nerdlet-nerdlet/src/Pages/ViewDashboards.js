import React from 'react';
import ExportTerraform from '../Partials/ExportTerraform';
import ExportJson from '../Partials/ExportJson';
import {
    Button,
    Modal,
    HeadingText,
    AccountPicker,
    Tabs,
    TabsItem
} from 'nr1'

class ViewDashboard extends React.Component {

    modalCallback = undefined;

    constructor(props) {
        super(props);

        this.state = ViewDashboard.getState(props);

        this.openImport = this.openImport.bind(this);
        this.closeImport = this.closeImport.bind(this);
        this.onChangeAccount = this.onChangeAccount.bind(this);
    }

    static getState(props) {
        return {
            quickstart: props.quickstart,
            importModelHidden: true,
            accountId: null,
            dashboardJson: {},
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.quickstart || (state.quickstart.id !== props.quickstart.id)) {
            return ViewDashboard.getState(props);
        }
        return null
    }

    openImport(file) {
        let url = 'https://newrelic-experimental.github.io/quickstarts/data/' + this.state.quickstart.id + '/dashboards/' + file;
        fetch(url)
            .then(response => response.json())
            .then((response) => {
                let dashboard = response;
                dashboard.dashboard_account_id = this.state.accountId;
                this.setState({
                    dashboardJson: dashboard,
                });
            })
        this.setState({
            importModelHidden: false
        });
    }

    closeImport() {
        this.setState({
            importModelHidden: true
        });
    }

    onChangeAccount(value) {
        let dashboard = {... this.state.dashboardJson};
        dashboard.dashboard_account_id = value;

        this.setState({
            accountId: value,
            dashboardJson: dashboard,
        });
    }

    render() {
        return (
            <>
                <Modal hidden={this.state.importModelHidden} onClose={this.closeImport}>
                    <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_1}>Import dashboard</HeadingText>
                    <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_3}>1. Select your account</HeadingText>
                    <AccountPicker
                        value={this.state.accountId}
                        onChange={this.onChangeAccount}
                        spacingType={[AccountPicker.SPACING_TYPE.LARGE]}
                    />
                    {this.state.accountId !== null &&
                        <>
                            <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_3}>2. Import</HeadingText>
                            <Tabs defaultValue="tab-1">
                                <TabsItem value="tab-1" label="Account import">
                                    <p>Soon ..</p>
                                </TabsItem>
                                <TabsItem value="tab-2" label="Terraform">
                                    <ExportTerraform json={this.state.dashboardJson} />
                                </TabsItem>
                                <TabsItem value="tab-3" label="Json">
                                    <ExportJson json={this.state.dashboardJson} />
                                </TabsItem>
                            </Tabs>
                        </>
                    }
                </Modal>

                <div className="dashboards">
                    <h3>Dashboards</h3>

                    {this.state.quickstart.dashboards.map((dashboard) => {
                        return (
                            <div key={dashboard.filename} className="row px-4 py-4">
                                <div className="col-6 py-1">
                                    <h3>{dashboard.name}</h3>
                                </div>
                                <div className="col-6 text-right">
                                    <Button
                                        onClick={(e) => { this.openImport(dashboard.filename) }}
                                        type={Button.TYPE.PLAIN}
                                        iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__IMPORT}
                                    >Import</Button>
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
            </>
        );
    }
}

export default ViewDashboard;
