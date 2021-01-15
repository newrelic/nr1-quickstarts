import React from 'react';
import { Link } from "react-router-dom";
import ExportModal from './Modals/ExportModal';
import {
    BlockText,
    Button,
    EntityTitleTableRowCell,
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
    Spinner,
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
                            reporting
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

    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.openTools = this.openTools.bind(this);
        this.closeTools = this.closeTools.bind(this);

        this.state = {
            toolsModalHidden: true,
            search: {
                'name': '%',
            },
        };
    }

    openTools(guid) {
        this.setState({
            dashboardGuid: guid,
            toolsModalHidden: false,
        });
    }

    closeTools() {
        this.setState({
            dashboardGuid: null,
            toolsModalHidden: true
        });
    }

    onChangeAccount(event, value) {
        this.setState({
            accountId: value
        });
    }

    search(event) {
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

    getCreator(tags) {
        let creatorTag = tags.filter(tag => tag.key == 'createdBy');
        if (creatorTag && creatorTag.length > 0 && creatorTag[0].values && creatorTag[0].values.length > 0) {
            return creatorTag[0].values[0];
        } else {
            return '';
        }
    }

    render() {
        return (
            <>
                <Grid>
                    <GridItem columnSpan={8}>
                        <HeadingText type={HeadingText.TYPE.HEADING_2}>Tools</HeadingText>
                    </GridItem>
                    <GridItem columnSpan={4} className="text-right">
                        <Link className="" to={"/"}>
                            <Button
                                type={Button.TYPE.PRIMARY}
                                iconType={Button.ICON_TYPE.LOCATION__LOCATION__HOME}
                            >Back to listing</Button>
                        </Link>
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <p>Below is a list of all the dashboards you have access to within New Relic. You can click on any of them to get a list of export options.</p>
                        <TextField className="custom-textfield" placeholder="Search" type={TextField.TYPE.SEARCH} onChange={this.search} spacingType={[TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE, TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE]} />
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
                                            <TableRow onClick={(evt, { item, index }) => { this.openTools(item.guid); }}>
                                                <EntityTitleTableRowCell value={item} />
                                                <TableRowCell>{item.account.name}</TableRowCell>
                                                <TableRowCell>{this.getCreator(item.tags)}</TableRowCell>
                                            </TableRow>
                                        )}
                                    </Table>
                                </>

                            )
                        }}
                        </NerdGraphQuery>
                    </GridItem>
                </Grid>

                <ExportModal hidden={this.state.toolsModalHidden} onClose={this.closeTools} sourceGuid={this.state.dashboardGuid} />
            </>
        );
    }
}

export default Tools;
