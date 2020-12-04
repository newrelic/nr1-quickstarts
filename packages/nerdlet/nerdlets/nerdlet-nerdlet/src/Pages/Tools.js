import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import ExportTerraform from '../Partials/ExportTerraform';
import ExportJson from '../Partials/ExportJson';
import {
    Button,
    BlockText,
    EntityTitleTableRowCell,
    Icon,
    Grid,
    GridItem,
    NerdGraphQuery,
    TextField,
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableRowCell,
    HeadingText,
    Modal,
    AccountPicker,
    Spinner,
    Tabs,
    TabsItem,
} from 'nr1';


class Tools extends React.Component {

    modalCallback = undefined;
    searchTimeout = undefined;

    searchQuery = `
    query($name: String!) {
        actor {
            entitySearch(queryBuilder: {type: DASHBOARD, name: $name}) {
                count
                query
                results {
                    entities {
                        account {
                            name
                            id
                        }
                        ... on DashboardEntityOutline {
                            guid
                            name
                            accountId
                            tags {
                                key
                                values
                            }
                        }
                    }
                }
            }
        }
    }
    `;

    downloadQuery = `
    query($guid: EntityGuid!){
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
                    visualization
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
            name
            guid
            owner {
                email
            }
            permissions
        }
    }
    `;

    constructor(props) {
        super(props);

        this._search = this._search.bind(this);
        this._getActions = this._getActions.bind(this);
        this.openTools = this.openTools.bind(this);
        this.closeTools = this.closeTools.bind(this);
        this.onChangeAccount = this.onChangeAccount.bind(this);
        this.onDashboardNameChange = this.onDashboardNameChange.bind(this);
        this.onCopyDashboard = this.onCopyDashboard.bind(this);

        this.state = {
            toolsModalHidden: true,
            dashboardJson: '',
            dashboardName: '',
            dashboardLoading: true,
            search: {
                'name': '%',
            },
        };
    }

    openTools(guid) {
        const data = NerdGraphQuery.query({query: this.downloadQuery, variables: {guid: guid}})
        data.then(results => {
            console.log("received", results);
            this.setState({
                dashboardJson: results.data.actor.entity,
                dashboardName: results.data.actor.entity.name + ' Clone',
                dashboardLoading: false,
            });
        }).catch((error) => { console.log('Nerdgraph Error:', error); })

        this.setState({
            toolsModalHidden: false,
            dashboardLoading: true,
        });
    }

    closeTools() {
        this.setState({
            toolsModalHidden: true
        });
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
        }).catch((error) => { console.log('Nerdgraph Error:', error); })
    }



    _search(event) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        let search = event.target.value
        this.searchTimeout = setTimeout(() => {
            this.setState({
                search: {
                    'name': '%' + search + '%',
                }
            })
        }, 500);
    }

    _getActions() {
        return [
            {
                label: 'Open tools',
                iconType: TableRow.ACTIONS_ICON_TYPE.INTERFACE__OPERATIONS__ALERT,
                onClick: (evt, { item, index }) => {
                    this.openTools();
                },
            },
        ];
    }

    render() {
        return (
            <>
                <Grid>
                    <GridItem columnSpan={8}>
                        <HeadingText type={HeadingText.TYPE.HEADING_2}>Tools - Dashboards</HeadingText>
                    </GridItem>
                    <GridItem columnSpan={4} className="custom-align-right">
                        <Link className="btn btn-default" to={"/"}>
                            <FontAwesomeIcon icon={faHome} /> Back to listing
                        </Link>
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <TextField className="custom-textfield" placeholder="Search" type={TextField.TYPE.SEARCH} onChange={this._search} spacingType={[TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE, TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE]} />
                        <NerdGraphQuery query={this.searchQuery} variables={this.state.search}>
                        {({ data, error, loading }) => {
                            if (loading) return <Spinner className="custom-spinner" spacingType={[Spinner.SPACING_TYPE.LARGE, Spinner.SPACING_TYPE.LARGE, Spinner.SPACING_TYPE.LARGE, Spinner.SPACING_TYPE.LARGE]} />
                            if (error) return <BlockText>{error.message}</BlockText>
                            return (
                                <>
                                    {data.actor.entitySearch.count > 200 &&
                                        <p><b>You have access to more than 200 dashboards, please use search to narrow your results.</b></p>
                                    }
                                    <Table items={data.actor.entitySearch.results.entities}>
                                        <TableHeader>
                                            <TableHeaderCell>Name</TableHeaderCell>
                                            <TableHeaderCell>Account</TableHeaderCell>
                                            <TableHeaderCell>Created by</TableHeaderCell>
                                        </TableHeader>
                                        {({ item }) => (
                                            <TableRow actions={this._getActions()} onClick={(evt, { item, index }) => { this.openTools(item.guid); }}>
                                                <EntityTitleTableRowCell value={item} />
                                                <TableRowCell>{item.account.name}</TableRowCell>
                                                <TableRowCell>{item.tags.filter(tag => tag.key == 'createdBy')[0].values[0]}</TableRowCell>
                                            </TableRow>
                                        )}
                                    </Table>
                                </>

                            )
                        }}
                        </NerdGraphQuery>
                    </GridItem>
                </Grid>

                <Modal hidden={this.state.toolsModalHidden} onClose={this.closeTools}>
                    <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_1}>Export dashboard</HeadingText>
                    <Tabs defaultValue="tab-1">
                        <TabsItem value="tab-1" label="Copy to">
                            <p>Where do you want to copy the dashboard to?</p>
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
                            >Copy dashboard</Button>
                        </TabsItem>
                        <TabsItem value="tab-2" label="Generate Terraform">
                            {this.state.dashboardLoading && <Spinner />}
                            {!this.state.dashboardLoading && <ExportTerraform json={this.state.dashboardJson} />}
                        </TabsItem>
                        <TabsItem value="tab-3" label="Export Json">
                            {this.state.dashboardLoading && <Spinner />}
                            {!this.state.dashboardLoading && <ExportJson json={this.state.dashboardJson} />}
                        </TabsItem>
                    </Tabs>
                </Modal>
            </>
        );
    }
}

export default Tools;
