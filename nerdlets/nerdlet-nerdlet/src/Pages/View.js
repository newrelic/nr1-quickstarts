import React from 'react';
import ExportModal from './Modals/ExportModal';
import { Link } from 'react-router-dom';
import {
  AccountPicker,
  Button,
  HeadingText,
  List,
  ListItem,
  Grid,
  GridItem,
} from 'nr1';
import InstallationInstructions from '../Partials/InstallationInstructions';
import PropTypes from 'prop-types';

class View extends React.Component {
  static getState(props) {
    return {
      quickstart: props.data.quickstarts.find(
        (element) => element.id === props.match.params.handle
      ),
      path: props.match.path,
      dashboardUrl: '',
      toolsModalHidden: true,
      accountId: null,
    };
  }

  constructor(props) {
    super(props);

    this.onChangeAccount = this.onChangeAccount.bind(this);
    this.openTools = this.openTools.bind(this);
    this.closeTools = this.closeTools.bind(this);

    this.state = View.getState(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      !state.quickstart ||
      state.quickstart.id !== props.match.params.handle
    ) {
      return View.getState(props);
    }
    return null;
  }

  modalCallback = undefined;

  onChangeAccount(event, value) {
    this.setState({
      accountId: value,
    });
  }

  openTools(file) {
    const url = `https://newrelic.github.io/quickstarts/data/${this.state.quickstart.id}/dashboards/${file}`;

    this.setState((prevState) => ({
      ...prevState,
      dashboardUrl: url,
      toolsModalHidden: false,
    }));
  }

  closeTools() {
    this.setState({
      toolsModalHidden: true,
      dashboardUrl: null,
    });
  }

  render() {
    if (!this.state.quickstart) {
      return (
        <Grid>
          <GridItem columnSpan={12}>
            <HeadingText
              type={HeadingText.TYPE.HEADING_2}
              className="padding-bottom"
            >
              Item not found
            </HeadingText>
            <Link to="/">
              <Button
                type={Button.TYPE.PRIMARY}
                iconType={Button.ICON_TYPE.LOCATION__LOCATION__HOME}
              >
                Back to listing
              </Button>
            </Link>
          </GridItem>
        </Grid>
      );
    }

    return (
      <>
        <Grid>
          <GridItem className="padding-top padding-bottom" columnSpan={8}>
            <HeadingText type={HeadingText.TYPE.HEADING_2}>
              {this.state.quickstart.name}
            </HeadingText>
          </GridItem>
          <GridItem
            columnSpan={4}
            className="text-right padding-top padding-bottom"
          >
            <Link to="/">
              <Button
                type={Button.TYPE.NORMAL}
                iconType={Button.ICON_TYPE.LOCATION__LOCATION__HOME}
              >
                Back to listing
              </Button>
            </Link>
          </GridItem>
        </Grid>
        <Grid className="background-grey">
          <GridItem columnSpan={3} className="padding-left">
            <HeadingText
              type={HeadingText.TYPE.HEADING_3}
              className="padding-top"
            >
              Description
            </HeadingText>
            <p>{this.state.quickstart.description}</p>

            <HeadingText
              type={HeadingText.TYPE.HEADING_3}
              className="padding-top"
            >
              Requirements
            </HeadingText>
            <p>
              Check if you have all the required datasources for these
              dashboards:
            </p>
            <AccountPicker
              value={this.state.accountId}
              onChange={this.onChangeAccount}
              spacingType={[AccountPicker.SPACING_TYPE.LARGE]}
            />
            <InstallationInstructions
              accountId={this.state.accountId}
              sources={this.state.quickstart.sources}
            />
            {this.state.quickstart.flex.length > 0 && (
              <div>
                <b>Flex configuration files</b>
                <p>
                  This dashboard uses custom flex data, please{' '}
                  <a
                    href="https://github.com/newrelic/nri-flex/blob/master/docs/basic-tutorial.md"
                    rel="noopener noreferrer"
                    target="_BLANK"
                  >
                    install the following Flex files.
                  </a>
                </p>
                <ul>
                  {this.state.quickstart.flex.map((flex) => {
                    return (
                      <li key={flex}>
                        <a
                          href={`./data/${this.state.quickstart.id}/flex/${flex}`}
                          target="_BLANK"
                          rel="noopener noreferrer"
                        >
                          {flex}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <HeadingText
              type={HeadingText.TYPE.HEADING_3}
              className="padding-top"
            >
              Dashboards
            </HeadingText>
            <List rowHeight={16}>
              {this.state.quickstart.dashboards.map((dashboard) => {
                return (
                  <ListItem key={dashboard.filename}>{dashboard.name}</ListItem>
                );
              })}
            </List>

            {this.state.quickstart.authors.length > 0 && (
              <div>
                <HeadingText
                  type={HeadingText.TYPE.HEADING_3}
                  className="padding-top"
                >
                  Authors
                </HeadingText>
                <ul>
                  {this.state.quickstart.authors.map((author) => {
                    return <li key={author}>{author}</li>;
                  })}
                </ul>
              </div>
            )}

            <HeadingText
              type={HeadingText.TYPE.HEADING_3}
              className="padding-top"
            >
              Problems or feedback?
            </HeadingText>
            <Button
              to={`https://github.com/newrelic/quickstarts/issues/new?labels=bug&title=Problem%20with%20${this.state.quickstart.id}`}
              type={Button.TYPE.PLAIN}
              iconType={
                Button.ICON_TYPE
                  .HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_WARNING
              }
            >
              Create a ticket
            </Button>
          </GridItem>

          <GridItem columnSpan={9} className="padding-top">
            <Grid>
              {this.state.quickstart.dashboards.map((dashboard) => {
                return (
                  <GridItem key={dashboard.filename} columnSpan={12}>
                    <Grid className="view-item">
                      <GridItem columnSpan={10}>
                        <HeadingText type={HeadingText.TYPE.HEADING_3}>
                          {dashboard.name}
                        </HeadingText>
                      </GridItem>
                      <GridItem columnSpan={2} className="text-right">
                        <Button
                          onClick={() => {
                            this.openTools(dashboard.filename);
                          }}
                          type={Button.TYPE.PRIMARY}
                          iconType={
                            Button.ICON_TYPE.INTERFACE__OPERATIONS__IMPORT
                          }
                        >
                          Import
                        </Button>
                      </GridItem>
                      {dashboard.screenshots.map((screenshot) => {
                        return (
                          <GridItem key={screenshot} columnSpan={6}>
                            <img
                              src={`https://newrelic.github.io/quickstarts/data/${this.state.quickstart.id}/dashboards/${screenshot}`}
                              className="card-img-top"
                              alt="..."
                            />
                          </GridItem>
                        );
                      })}
                    </Grid>
                  </GridItem>
                );
              })}
            </Grid>
          </GridItem>

          <ExportModal
            hidden={this.state.toolsModalHidden}
            onClose={this.closeTools}
            sourceUrl={this.state.dashboardUrl}
            accountId={this.state.accountId}
          />
        </Grid>
      </>
    );
  }
}

View.propTypes = {
  match: PropTypes.object,
};

export default View;
