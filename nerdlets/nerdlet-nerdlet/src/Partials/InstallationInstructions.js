import React from 'react';
import SourceAvailable from './SourceAvailable';
import PropTypes from 'prop-types';

class InstallationInstructions extends React.Component {
  constructor(props) {
    super(props);

    const installation = this.props.sources
      .sort()
      .map((source) => {
        // Speciale case if config specifically set's it's own options
        if (typeof source === 'object' && source !== null) {
          return source;
        }

        return this.props.sourceData.find((sourceDataElement) => {
          if (sourceDataElement.eventTypes.includes(source)) {
            sourceDataElement.source = source;
            return sourceDataElement;
          }

          return false;
        });
      })
      .sort(this.sorter)
      .filter(function (item, pos, ary) {
        if (!item.name) {
          return false;
        }
        return !pos || item.name !== ary[pos - 1].name;
      });

    this.state = {
      requirements: installation,
    };
  }

  sorter(a, b) {
    return a.name > b.name ? 1 : -1;
  }

  render() {
    return (
      <div>
        {this.state.requirements.sort(this.sorter).map((requirement) => {
          if (requirement.url) {
            return (
              <div key={requirement.name}>
                <b>
                  <SourceAvailable
                    accountId={this.props.accountId}
                    source={requirement.source}
                  />{' '}
                  {requirement.name} (
                  <a
                    href={requirement.url}
                    target="_BLANK"
                    rel="noopener noreferrer"
                  >
                    documentation
                  </a>
                  )
                </b>
                <br />
              </div>
            );
          } else {
            return <li key={requirement.name}>{requirement.name}</li>;
          }
        })}
      </div>
    );
  }
}

InstallationInstructions.propTypes = {
  sources: PropTypes.array,
  accountId: PropTypes.number,
  sourceData: PropTypes.object,
};

export default InstallationInstructions;
