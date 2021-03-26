import React from 'react';
import Home from './Home';
import { Grid, GridItem, Spinner } from 'nr1';
import * as config from '../config';

export default class Nerdlet extends React.Component {
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

    return <Home data={this.state.data} />;
  }
}
