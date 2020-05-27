import React from 'react';
import DatasourceItem from './DatasourceItem';

class Datasource extends React.Component {

  render() {
    return (
        <div className="sources">
            {this.props.sources.map((source, i) => {
                return (<DatasourceItem key={source} source={source} />)
            })}
        </div>
    );
  }

}

export default Datasource;
