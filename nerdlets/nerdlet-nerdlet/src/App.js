import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Home from './Pages/Home';
import View from './Pages/View';
import ScrollToTop from './Helpers/ScrollToTop';
import ToolsExport from './Pages/ToolsExport';
import { Grid, GridItem, Spinner } from 'nr1';
import * as config from '../config';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: undefined,
    };
  }

  componentDidMount() {
    fetch(config.URL_DATA_FILE)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          loading: false,
          data: response,
        });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <Grid>
          <GridItem columnSpan={12} className="text-center loading">
            <Spinner />
          </GridItem>
        </Grid>
      );
    }

    return (
      <HashRouter>
        <main role="main">
          <Switch>
            <Route
              path="/view/:handle"
              render={(props) => <View data={this.state.data} {...props} />}
            />
            <Route
              path="/tools/export"
              render={(props) => (
                <ToolsExport data={this.state.data} {...props} />
              )}
            />
            <Route
              path="/"
              render={(props) => <Home data={this.state.data} {...props} />}
            />
          </Switch>
        </main>

        <ScrollToTop />
      </HashRouter>
    );
  }
}

export default App;
