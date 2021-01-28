import React from 'react';
import DatasourceItem from './DatasourceItem';
import { List } from 'nr1';
import PropTypes from 'prop-types';

class Datasource extends React.Component {
  render() {
    return (
      <List>
        {this.props.sources.map((source) => {
          return <DatasourceItem key={source} source={source} />;
        })}
      </List>
    );
  }
}

Datasource.propTypes = {
  sources: PropTypes.array,
};

export default Datasource;
