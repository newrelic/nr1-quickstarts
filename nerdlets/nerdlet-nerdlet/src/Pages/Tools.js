import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import ExportTerraform from '../Partials/ExportTerraform';
import ExportJson from '../Partials/ExportJson';
import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableRowCell,
    HeadingText,
    Modal,
    AccountPicker,
    Tabs,
    TabsItem,
  } from 'nr1';

class Tools extends React.Component {

    modalCallback = undefined;

    constructor(props) {
        super(props);

        this._getItems = this._getItems.bind(this);
        this._getActions = this._getActions.bind(this);
        this.openTools = this.openTools.bind(this);
        this.closeTools = this.closeTools.bind(this);

        this.state = {
            toolsModalHidden: true,
            dashboardJson: '',
        };
    }

    openTools() {
        let url = 'https://newrelic-experimental.github.io/quickstarts/data/browser/dashboards/browser_overview.json';
        fetch(url)
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    dashboardJson: response,
                });
            })
        this.setState({
            toolsModalHidden: false
        });
    }

    closeTools() {
        this.setState({
            toolsModalHidden: true
        });
    }

    _getItems() {
        return [
            {
                'name': 'Dashboard 1',
                'owner': 'Samuel',
                'account': 'My account',
            }
        ]
    }

    _getActions() {
        return [
            {
                label: 'Open tools',
                iconType: TableRow.ACTIONS_ICON_TYPE.INTERFACE__OPERATIONS__ALERT,
                onClick: (evt, { item, index }) => {
                    this.openTools();
                },
            }
        ];
    }

    render() {
        return (
            <div className="container" id="root">
                <div className="row header">
                    <div className="col-8">
                        <h2>Tools</h2>
                    </div>
                    <div className="col-4 text-right">
                        <Link className="btn btn-default" to={"/"}>
                            <FontAwesomeIcon icon={faHome} /> Back to listing
                        </Link>
                    </div>
                </div>
                <div className="row pt-4">
                    <div className="col-12">
                        <Table items={this._getItems()}>
                            <TableHeader>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Owner</TableHeaderCell>
                                <TableHeaderCell>Account</TableHeaderCell>
                            </TableHeader>
                            {({ item }) => (
                                <TableRow actions={this._getActions()}>
                                    <TableRowCell>{item.name}</TableRowCell>
                                    <TableRowCell>{item.owner}</TableRowCell>
                                    <TableRowCell>{item.account}</TableRowCell>
                                </TableRow>
                            )}
                        </Table>
                    </div>
                </div>
                <Modal hidden={this.state.toolsModalHidden} onClose={this.closeTools}>
                    <HeadingText spacingType={[AccountPicker.SPACING_TYPE.LARGE]} type={HeadingText.TYPE.HEADING_1}>Export dashboard</HeadingText>
                    <Tabs defaultValue="tab-1">
                        <TabsItem value="tab-1" label="Copy to">
                            <p>Soon ..</p>
                        </TabsItem>
                        <TabsItem value="tab-2" label="Generate Terraform">
                            <ExportTerraform json={this.state.dashboardJson} />
                        </TabsItem>
                        <TabsItem value="tab-3" label="Export Json">
                            <ExportJson json={this.state.dashboardJson} />
                        </TabsItem>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}

export default Tools;
