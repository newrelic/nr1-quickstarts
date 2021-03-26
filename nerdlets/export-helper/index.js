import React from 'react';
import {
  Badge,
  Link,
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
  navigation,
  nerdlet,
} from 'nr1';

class ExportNerdlet extends React.Component {
  constructor(props) {
    super(props);

    nerdlet.setConfig({
      timePicker: false,
    });

    this.search = this.search.bind(this);

    this.state = {
      search: {
        name: '%',
      },
    };
  }

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

  search(event) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const search = event.target.value;
    this.searchTimeout = setTimeout(() => {
      this.setState({
        search: {
          name: `%${search}%`,
        },
      });
    }, 500);
  }

  getCreator(tags) {
    const creatorTag = tags.filter((tag) => tag.key === 'createdBy');
    if (
      creatorTag &&
      creatorTag.length > 0 &&
      creatorTag[0].values &&
      creatorTag[0].values.length > 0
    ) {
      return creatorTag[0].values[0];
    } else {
      return '';
    }
  }

  render() {
    return (
      <>
        <Grid>
          <GridItem className="padding-top padding-left" columnSpan={8}>
            <HeadingText type={HeadingText.TYPE.HEADING_2}>
              Export dashboard
            </HeadingText>
          </GridItem>
          <GridItem
            columnSpan={4}
            className="text-right padding-top padding-left"
          >
            <Link
              className=""
              to={navigation.getReplaceNerdletLocation({ id: 'landing' })}
            >
              <Button
                type={Button.TYPE.PRIMARY}
                iconType={Button.ICON_TYPE.LOCATION__LOCATION__HOME}
              >
                Back to listing
              </Button>
            </Link>
          </GridItem>
          <GridItem columnSpan={12} className="padding-left">
            <p>
              Below is a list of all the dashboards you have access to within
              New Relic. You can click on any of them to get a list of export
              options.
            </p>
            <TextField
              className="custom-textfield"
              placeholder="Search"
              type={TextField.TYPE.SEARCH}
              onChange={this.search}
              spacingType={[
                TextField.SPACING_TYPE.LARGE,
                TextField.SPACING_TYPE.NONE,
                TextField.SPACING_TYPE.LARGE,
                TextField.SPACING_TYPE.NONE,
              ]}
            />
          </GridItem>
          <GridItem columnSpan={12}>
            <NerdGraphQuery
              query={this.searchQuery}
              variables={this.state.search}
            >
              {({ data, error, loading }) => {
                if (loading)
                  return (
                    <Spinner
                      className="custom-spinner"
                      spacingType={[
                        Spinner.SPACING_TYPE.LARGE,
                        Spinner.SPACING_TYPE.LARGE,
                        Spinner.SPACING_TYPE.LARGE,
                        Spinner.SPACING_TYPE.LARGE,
                      ]}
                    />
                  );
                if (error) return <BlockText className="padding-left">{error.message}</BlockText>;
                return (
                  <>
                    {data.actor.entitySearch.count > 200 && (
                      <BlockText className="padding-left">
                        <Badge type={Badge.TYPE.WARNING}>Warning</Badge> You
                        have access to more than 200 dashboards, please use
                        search to narrow your results.
                      </BlockText>
                    )}
                    <Table
                      items={data.actor.entitySearch.results.entities}
                      ariaLabel="List of available dashboards"
                    >
                      <TableHeader>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Account</TableHeaderCell>
                        <TableHeaderCell>Created by</TableHeaderCell>
                      </TableHeader>
                      {({ item }) => (
                        <TableRow
                          onClick={() =>
                            navigation.openStackedNerdlet({
                              id: 'transfer',
                              urlState: {
                                dashboardGuid: item.guid,
                              },
                            })
                          }
                        >
                          <EntityTitleTableRowCell value={item} />
                          <TableRowCell>{item.account.name}</TableRowCell>
                          <TableRowCell>
                            {this.getCreator(item.tags)}
                          </TableRowCell>
                        </TableRow>
                      )}
                    </Table>
                  </>
                );
              }}
            </NerdGraphQuery>
          </GridItem>
        </Grid>
      </>
    );
  }
}

export default ExportNerdlet;
