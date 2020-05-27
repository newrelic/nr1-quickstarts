import React from 'react';

class DatasourceItem extends React.Component {

  constructor(props) {
    super(props);

    let name = '';

    switch(props.source) {
        case 'Transaction': name = 'APM'; break;
        case 'SystemSample': name = 'Infrastructure'; break;
        case 'ProcessSample': name = 'Infrastructure - Processes'; break;
        default:
          // Speciale case if config specifically set's it's own options
          if (typeof props.source === 'object' && props.source !== null) {
            name = props.source.name;
          } else {
            name = props.source;
          }
        break;
    }

    this.state = {
        name,
    };
  }

  render() {
    return (
      <span className="badge badge-dark">{this.state.name}</span>
    );
  }

}

export default DatasourceItem;
