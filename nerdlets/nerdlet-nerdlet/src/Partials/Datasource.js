import React from 'react';
import DatasourceItem from './DatasourceItem';
import { List } from 'nr1';

class Datasource extends React.Component {

    render() {
        return (
            <List>
                {this.props.sources.map((source, i) => {
                    return (<DatasourceItem key={source} source={source} />)
                })}
            </List>
        );
    }
}

export default Datasource;
