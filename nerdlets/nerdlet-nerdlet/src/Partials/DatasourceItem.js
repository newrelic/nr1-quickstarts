import React from 'react';
import { ListItem } from 'nr1';
import PropTypes from 'prop-types';


class DatasourceItem extends React.Component {
  static getProduct(source) {
    let name = '';

    switch (source) {
      case 'Transaction':
        name = 'APM';
        break;
      case 'SystemSample':
        name = 'Infrastructure';
        break;
      case 'ProcessSample':
        name = 'Infrastructure - Processes';
        break;
      case 'BrowserInteraction':
        name = 'Browser - Interactions';
        break;
      case 'JavaScriptError':
        name = 'Browser - Javascript';
        break;
      case 'PageViewTiming':
        name = 'Browser - Pageview timing';
        break;
      case 'PageView':
        name = 'Browser - Pageviews';
        break;
      case 'SyntheticCheck':
        name = 'Synthetics';
        break;
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

  constructor(props) {
    super(props);

    this.state = {
      name: DatasourceItem.getProduct(props.source),
    };
  }

  render() {
    return <ListItem>{this.state.name}</ListItem>;
  }
}

DatasourceItem.propTypes = {
  source: PropTypes.string,
};

export default DatasourceItem;
