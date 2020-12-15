import React from 'react';
import ExportJson from '../../Partials/ExportJson';
import {
    Button,
    Icon,
    Grid,
    GridItem,
    NerdGraphQuery,
    TextField,
    HeadingText,
    Modal,
    AccountPicker,
    Spinner,
    Tabs,
    TabsItem,
    Toast,
} from 'nr1';


class ExportModal extends React.Component {

    modalCallback = undefined;

    downloadQuery = `
    query($guid: EntityGuid!) {
        actor {
            entity(guid: $guid) {
                ... on DashboardEntity {
                    name
                    description
                    pages {
                        name
                        description
                        widgets {
                            id
                            visualization {
                                id
                            }
                            layout {
                                column
                                row
                                height
                                width
                            }
                            title
                            configuration {
                                area {
                                    queries {
                                        accountId
                                        nrql
                                    }
                                }
                                line {
                                    queries {
                                        accountId
                                        nrql
                                    }
                                }
                                bar {
                                    queries {
                                        accountId
                                        nrql
                                    }
                                }
                                billboard {
                                    queries {
                                        accountId
                                        nrql
                                    }
                                    thresholds {
                                        alertSeverity
                                        value
                                    }
                                }
                                pie {
                                    queries {
                                        accountId
                                        nrql
                                    }
                                }
                                table {
                                    queries {
                                        accountId
                                        nrql
                                    }
                                }
                                markdown {
                                    text
                                }
                            }
                            rawConfiguration
                        }
                    }
                }
            }
        }
    }
    `;

    createQuery = `
    mutation($accountId: Int!, $dashboard: DashboardInput!) {
        dashboardCreate(accountId: $accountId, dashboard: $dashboard) {
            entityResult {
                guid
            }
        }
    }
    `;

    constructor(props) {
        super(props);

        this.closeModal = this.closeModal.bind(this);
        this.onChangeAccount = this.onChangeAccount.bind(this);
        this.onDashboardNameChange = this.onDashboardNameChange.bind(this);
        this.onCopyDashboard = this.onCopyDashboard.bind(this);

        // Set initial state
        this.state = {
            dashboardJson: '',
            dashboardName: '',
            dashboardLoading: true,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sourceGuid !== this.props.sourceGuid) {
            this.loadGuid(this.props.sourceGuid);
        } else if (prevProps.sourceUrl !== this.props.sourceUrl) {
            this.loadJson(this.props.sourceUrl);
        }
    }

    loadGuid(guid) {
        const data = NerdGraphQuery.query({query: this.downloadQuery, variables: {guid: guid}})
        data.then(results => {
            this.setState({
                dashboardJson: results.data.actor.entity,
                dashboardName: results.data.actor.entity.name + ' Clone',
                dashboardLoading: false,
            });
        }).catch((error) => { console.log('Nerdgraph Error:', error); })
    }

    loadJson(url) {
        fetch(url)
            .then(response => response.json())
            .then((response) => {
                let dashboard = response;
                dashboard.dashboard_account_id = this.state.accountId;
                this.setState({
                    dashboardName: dashboard.title,
                    dashboardJson: dashboard,
                    dashboardLoading: false,
                });
            })
    }

    closeModal(event, value) {
        this.props.onClose(event, value);
    }

    onChangeAccount(event, value) {
        this.setState({
            accountId: value
        });
    }

    onDashboardNameChange(event) {
        this.setState({
            dashboardName: event.target.value
        });
    }

    filterAll(data, filterElement) {
        for(var key in data) {
            if (Array.isArray(data[key]) || typeof(data[key]) == "object") {
                this.filterAll(data[key], filterElement);
            }
            if (key == filterElement) {
                delete data[key];
            }
        }

        return data;
    }

    onCopyDashboard() {
        let dashboardData = this.state.dashboardJson;

        // Set the right dashboard name
        dashboardData.name = this.state.dashboardName;

        // Set the dashboard as private by default
        // TODO: Give customer the option
        dashboardData.permissions = 'PRIVATE';

        // Filter out __typename as the mutator is not a fan
        dashboardData = this.filterAll(dashboardData, '__typename');

        // Create copy of dashboard
        const data = NerdGraphQuery.query({query: this.createQuery, variables: {
            accountId: this.state.accountId,
            dashboard: dashboardData,
        }});
        data.then(results => {
            console.log("created", results);
            Toast.showToast({
                title: 'Dashboard created',
                description: 'The dashboard was copied to your selected account.',
                type: Toast.TYPE.NORMAL
            })
        }).catch((error) => { console.log('Nerdgraph Error:', error); })
    }

    render() {
        if (this.props.hidden) {
            return null;
        }

        if (this.state.dashboardLoading) {
            return <Spinner />;
        }

        return (
            <Modal hidden={this.props.hidden} onClose={this.closeModal}>
                <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_1}>Export dashboard</HeadingText>
                <Tabs defaultValue="tab-1">
                    <TabsItem value="tab-1" label="Import into">
                        <p className="padding-top">Where do you want to import the dashboard into?</p>
                        <AccountPicker
                            value={this.state.accountId}
                            onChange={this.onChangeAccount}
                            spacingType={[AccountPicker.SPACING_TYPE.LARGE]}
                        />
                        <p>How do you want to name the dashboard?</p>
                        <Grid>
                            <GridItem columnSpan={12}>
                                <TextField className="custom-textfield" value={this.state.dashboardName} type={TextField.TYPE.TEXT} onChange={this.onDashboardNameChange} spacingType={[TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE, TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE]} />
                            </GridItem>
                        </Grid>
                        <Button
                            type={Button.TYPE.PRIMARY}
                            iconType={Icon.TYPE.INTERFACE__OPERATIONS__COPY_TO}
                            onClick={this.onCopyDashboard}
                        >Import dashboard</Button>
                    </TabsItem>
                    <TabsItem value="tab-3" label="Export Json">
                        <ExportJson json={this.state.dashboardJson} />
                    </TabsItem>
                </Tabs>
            </Modal>
        );
    }
}

export default ExportModal;
