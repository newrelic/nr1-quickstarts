import React from 'react';
import ExportJson from '../../Partials/ExportJson';
import {
    Button,
    Icon,
    Grid,
    GridItem,
    NerdGraphQuery,
    NerdGraphMutation,
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
                            # Disabled because our import API cannot accept configuration and rawConfiguration
                            # Can enabled again the future when the API supports both
                            # configuration {
                            #     area {
                            #         nrqlQueries {
                            #             accountId
                            #             query
                            #         }
                            #    }
                            #     line {
                            #         nrqlQueries {
                            #             accountId
                            #             query
                            #         }
                            #    }
                            #     bar {
                            #         nrqlQueries {
                            #             accountId
                            #             query
                            #         }
                            #    }
                            #     billboard {
                            #         nrqlQueries {
                            #             accountId
                            #             query
                            #       }
                            #         thresholds {
                            #             alertSeverity
                            #             query
                            #         }
                            #   }
                            #     pie {
                            #         nrqlQueries {
                            #             accountId
                            #             query
                            #         }
                            #   }
                            #     table {
                            #         nrqlQueries {
                            #             accountId
                            #             query
                            #         }
                            #   }
                            #     markdown {
                            #         text
                            #     }
                            # }
                            rawConfiguration
                        }
                    }
                }
            }
        }
    }
    `;

    createMutation = `
    mutation($accountId: Int!, $dashboard: DashboardInput!) {
        dashboardCreate(accountId: $accountId, dashboard: $dashboard) {
            errors {
                description
                type
            }
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
            dashboardUrl: null,
            dashboardName: '',
            dashboardLoading: true,
            submitted: false,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sourceGuid !== this.props.sourceGuid) {
            this.loadGuid(this.props.sourceGuid);
        } else if (prevProps.sourceUrl !== this.props.sourceUrl) {
            this.loadJson(this.props.sourceUrl);
        }

        if (prevProps.accountId !== this.props.accountId) {
            this.setState({
                accountId: this.props.accountId,
            })
        }
    }

    loadGuid(guid) {
        // Reset view
        this.setState({
            dashboardJson: '',
            dashboardName: '',
            dashboardUrl: null,
            dashboardLoading: true,
        });

        const data = NerdGraphQuery.query({
            query: this.downloadQuery,
            variables: {guid: guid},
        })
        data.then((results) => {
            this.setState({
                dashboardJson: this.filterDashboard(results.data.actor.entity),
                dashboardName: results.data.actor.entity.name + ' Clone',
                dashboardLoading: false,
            });
        }).catch((error) => {
            console.log('Nerdgraph Error:', error);
        });
    }

    loadJson(url) {
        // Reset view
        this.setState({
            dashboardJson: '',
            dashboardUrl: url,
            dashboardName: '',
            dashboardLoading: true,
        });

        fetch(url)
            .then(response => response.json())
            .then((response) => {
                let dashboard = response;
                this.setState({
                    dashboardName: dashboard.name,
                    dashboardJson: this.filterDashboard(dashboard),
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

    loopAll(data, filterParent, filterElement, callback, parentMatch) {
        for(var key in data) {
            if (Array.isArray(data[key]) || typeof(data[key]) == "object") {
                if (!Array.isArray(data)) {
                    parentMatch = key;
                }

                // Check if the current key matches our parent or we don't need to filter on a parent
                this.loopAll(data[key], filterParent, filterElement, callback, parentMatch);
            }
            if (key === filterElement && (filterParent === parentMatch || filterParent === null)) {
                data = callback(data, key);
            }
        }

        return data;
    }

    filterAll(data, filterParent, filterElement) {
        return this.loopAll(data, filterParent, filterElement, (data, key) => {
            delete data[key];

            return data;
        });
    }

    replaceAll(data, filterParent, filterElement, filterValue) {
        return this.loopAll(data, filterParent, filterElement, (data, key) => {
            data[key] = filterValue;

            return data;
        });
    }

    filterDashboard(dashboardData, forImport = false) {
        // We want to filter out some elements because they are either:
        // - Not needed in the create mutation
        // - Account specific

        // Filter out __typename as the mutator is not a fan
        dashboardData = this.filterAll(dashboardData, null, '__typename');

        // Filter out widget Id's because they will change anyway.
        dashboardData = this.filterAll(dashboardData, 'widgets', 'id');

        // Set accountId to right value depending on case
        if (forImport) {
            // Dashboard is being imported, lets replace accountId with current set accountId
            dashboardData = this.replaceAll(dashboardData, 'nrqlQueries', 'accountId', this.state.accountId);
        } else {
            // Change all accounts to 0, so we don't expose sensitive information
            dashboardData = this.replaceAll(dashboardData, 'nrqlQueries', 'accountId', 0);
        }

        return dashboardData;
    }

    onCopyDashboard() {
        // Stop user from pressing button twice
        this.setState({
            submitted: true,
            errorAccountId: false,
            errorDashboardName: false,
        });

        // Check if accountId has been set and the dashboardname is not empty
        let error = false;
        if (!this.state.accountId > 0) {
            error = true;
            this.setState({
                submitted: false,
                errorAccountId: true,
            });
        }
        if (this.state.dashboardName.trim().length === 0) {
            error = true;
            this.setState({
                submitted: false,
                errorDashboardName: true,
            });
        }
        if(error) {
            // Let's stop here
            return;
        }

        let dashboardData = this.state.dashboardJson;

        // Set the right dashboard name
        dashboardData.name = this.state.dashboardName;

        // Set the dashboard as private by default
        // TODO: Give customer the option
        dashboardData.permissions = 'PRIVATE';

        // Filter any variables and set accountId
        dashboardData = this.filterDashboard(dashboardData, true);

        // Create copy of dashboard
        const data = NerdGraphMutation.mutate({
            mutation: this.createMutation,
            variables: {
                accountId: this.state.accountId,
                dashboard: dashboardData,
            }
        });
        data.then(results => {
            if ('errors' in results.data.dashboardCreate && results.data.dashboardCreate.errors !== null) {
                console.log("Nerdgraph Error:", results);
                this._importFail();
                return;
            }

            console.log("created", results);
            this._importSuccess();
        }).catch((error) => {
            console.log('Nerdgraph Error:', error);
            this._importFail();
        })
    }

    _importSuccess() {
        Toast.showToast({
            title: 'Dashboard created',
            description: 'The dashboard was copied to your selected account.',
            type: Toast.TYPE.NORMAL
        });

        this.setState({
            submitted: false,
        });

        this.closeModal();
    }

    _importFail() {
        Toast.showToast({
            title: 'Dashboard error',
            description: 'An error occurred and the dashboard was not created, please try again at a later time.',
            type: Toast.TYPE.CRITICAL
        });

        this.setState({
            submitted: false,
        });
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
                <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_1}>Import/Export dashboard</HeadingText>
                <Tabs defaultValue="tab-1">
                    <TabsItem value="tab-1" label="Import into">
                        <p className="padding-top">Where do you want to import the dashboard into?</p>
                        {this.state.errorAccountId &&
                            <p className="text-red">Please choose an account!</p>
                        }
                        <AccountPicker
                            value={this.state.accountId}
                            onChange={this.onChangeAccount}
                            spacingType={[AccountPicker.SPACING_TYPE.LARGE]}
                        />

                        <p>How do you want to name the dashboard?</p>
                        {this.state.errorDashboardName &&
                            <p className="text-red">Please choose a dashboard name!</p>
                        }
                        <Grid>
                            <GridItem columnSpan={12}>
                                <TextField className="custom-textfield" value={this.state.dashboardName} type={TextField.TYPE.TEXT} onChange={this.onDashboardNameChange} spacingType={[TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE, TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE]} />
                            </GridItem>
                        </Grid>

                        <Button
                            type={Button.TYPE.PRIMARY}
                            iconType={Icon.TYPE.INTERFACE__OPERATIONS__COPY_TO}
                            onClick={this.onCopyDashboard}
                            loading={this.state.submitted}
                        >
                            Import dashboard
                        </Button>
                    </TabsItem>
                    <TabsItem value="tab-3" label="Export Json">
                        {this.state.dashboardUrl &&
                            <p className="custom-export-json-link"><a href={this.state.dashboardUrl} rel="noopener noreferrer" target="_BLANK">Link to JSON</a></p>
                        }
                        <ExportJson json={this.state.dashboardJson} />
                    </TabsItem>
                </Tabs>
            </Modal>
        );
    }
}

export default ExportModal;
