import React from 'react';
import Preview from './Preview';
import DatasourceItem from './DatasourceItem';
import {
  Badge,
  BlockText,
  Link,
  Layout,
  LayoutItem,
  TextField,
  Grid,
  GridItem,
  HeadingText,
  navigation,
  nerdlet,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Tile,
} from 'nr1';
import PropTypes from 'prop-types';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.setSearch = this.setSearch.bind(this);
    this.search = this.search.bind(this);

    nerdlet.setConfig({
      timePicker: false,
    });
  }

  setSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  search(element) {
    const lowercaseSearch = this.state.search.toLowerCase();
    if (element.name.toLowerCase().includes(lowercaseSearch)) {
      return true;
    }

    const sources = element.sources.map((value) =>
      DatasourceItem.getProduct(value)
    );
    if (sources.toString().toLowerCase().includes(lowercaseSearch)) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <Layout>
        <LayoutItem
          type={LayoutItem.TYPE.SPLIT_LEFT}
          sizeType={LayoutItem.SIZE_TYPE.SMALL}
          className="padding-top padding-left"
        >
          <HeadingText type={HeadingText.TYPE.HEADING_1}>
            Quickstarts
          </HeadingText>
          <BlockText className="padding-top">
            Welcome to the New Relic dashboard library.
          </BlockText>

          <BlockText className="padding-top">
            <Link to="https://newrelic.github.io/quickstarts-synthetics-library/#/">
              New Relic's Synthetics library.
            </Link>
          </BlockText>

          <BlockText className="padding-top">
            Use the search bar to find a specific dashboard and click on any to
            get a more detailed description. If you want to add more dashboards
            or contribute to the code, please check out our{' '}
            <a
              href="https://github.com/newrelic/nr1-quickstarts"
              rel="noopener noreferrer"
              target="_BLANK"
            >
              Github repository
            </a>
          </BlockText>

          <HeadingText
            type={HeadingText.TYPE.HEADING_3}
            className="padding-top"
          >
            Links
          </HeadingText>
          <ul className="links">
            <li>
              <Link
                to={navigation.getOpenStackedNerdletLocation({
                  id: 'marketplace.home',
                })}
                rel="noopener noreferrer"
              >
                <Badge type={Badge.TYPE.INFO}>New</Badge> Instant Observability
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/newrelic/nr1-quickstarts/discussions"
                target="_BLANK"
                rel="noopener noreferrer"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="https://github.com/newrelic/nr1-quickstarts/issues/new/choose"
                target="_BLANK"
                rel="noopener noreferrer"
              >
                Report idea or issue
              </a>
            </li>
            <li>
              <a
                href="https://github.com/newrelic/nr1-quickstarts/"
                target="_BLANK"
                rel="noopener noreferrer"
              >
                Github repository
              </a>
            </li>
            <li className="padding-top">
              <Link
                to={navigation.getReplaceNerdletLocation({
                  id: 'export-helper',
                })}
              >
                Export helper
              </Link>
            </li>
          </ul>
        </LayoutItem>
        <LayoutItem className="list-view">
          <Grid>
            <GridItem columnSpan={12}>
              <Tile
                to={navigation.getOpenStackedNerdletLocation({
                  id: 'marketplace.home',
                })}
                type={Tile.TYPE.SOLID}
                className="notice-tile"
              >
                <Badge
                  type={Badge.TYPE.CRITICAL}
                  spacingType={[
                    Badge.SPACING_TYPE.OMIT,
                    Badge.SPACING_TYPE.MEDIUM,
                    Badge.SPACING_TYPE.OMIT,
                    Badge.SPACING_TYPE.MEDIUM,
                  ]}
                  className="notice-badge"
                >
                  <Icon
                    type={Icon.TYPE.INTERFACE__SIGN__EXCLAMATION__V_ALTERNATE}
                    color="red"
                  />{' '}
                  Notice
                </Badge>{' '}
                We will be archiving this application on January 31st 2022 and
                replacing it with the New Relic Instant Observability platform.
                Click here to check it out...
              </Tile>

              <TextField
                className="custom-textfield"
                placeholder="Search"
                type={TextField.TYPE.SEARCH}
                onChange={this.setSearch}
                spacingType={[
                  TextField.SPACING_TYPE.LARGE,
                  TextField.SPACING_TYPE.NONE,
                  TextField.SPACING_TYPE.LARGE,
                  TextField.SPACING_TYPE.NONE,
                ]}
              />
            </GridItem>
            <GridItem columnSpan={3}>
              <Link
                className="preview-item"
                to={navigation.getOpenStackedNerdletLocation({
                  id: 'marketplace.home',
                })}
              >
                <Card>
                  <CardHeader
                    title="New Relic Instant Observability"
                    subtitle="Browse our new platform which includes visualizations, apps,
                    or quickstarts filled with resources like dashboards,
                    instrumentation, and alerts."
                  />
                  <CardBody className="preview-image">
                    <img
                      src="https://i.ibb.co/sjf4Xfx/screenshot-IO.png"
                      alt="Instant Observability screenshot"
                    />
                    <Badge type={Badge.TYPE.INFO}>New</Badge>
                  </CardBody>
                </Card>
              </Link>
            </GridItem>
            {this.props.data.quickstarts
              .filter(this.search)
              .map((quickstart) => {
                return (
                  <Preview key={quickstart.name} quickstart={quickstart} />
                );
              })}
          </Grid>
        </LayoutItem>
      </Layout>
    );
  }
}

Home.propTypes = {
  data: PropTypes.object,
};

export default Home;
