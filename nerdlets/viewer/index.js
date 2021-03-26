import React from 'react';
import { Grid, GridItem, Spinner, NerdletStateContext } from 'nr1';
import * as config from '../config';

import View from './View';

export default class ViewNerdlet extends React.Component {
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
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <View dashboardId={nerdletState.dashboardId} data={this.state.data} />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}
