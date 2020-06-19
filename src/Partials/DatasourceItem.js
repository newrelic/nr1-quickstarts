import React from 'react';

class DatasourceItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        name: DatasourceItem.getProduct(props.source),
    };
  }

  static getProduct(source) {
    let name = '';

    switch(source) {
      case 'Transaction': name = 'APM'; break;
      case 'SystemSample': name = 'Infrastructure'; break;
      case 'ProcessSample': name = 'Infrastructure - Processes'; break;
      case 'BrowserInteraction': name = 'Browser - Interactions'; break;
      case 'JavaScriptError': name = 'Browser - Javascript'; break;
      case 'PageViewTiming': name = 'Browser - Pageview timing'; break;
      case 'PageView': name = 'Browser - Pageviews'; break;
      case 'SyntheticCheck': name = 'Synthetics'; break;
      default:
        // Speciale case if config specifically set's it's own options
        if (typeof source === 'object' && source !== null) {
          name = source.name;
        } else {
          name = source;
        }
      break;
    }

    return name;
  }

  render() {
    return (
      <span className="badge badge-dark">{this.state.name}</span>
    );
  }

}

export default DatasourceItem;
