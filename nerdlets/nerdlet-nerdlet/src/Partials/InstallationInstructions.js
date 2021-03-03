import React from 'react';
import SourceAvailable from './SourceAvailable';
import PropTypes from 'prop-types';

class InstallationInstructions extends React.Component {
  constructor(props) {
    super(props);

    const installation = this.props.requirements
      .sort()
      .map((requirement) => {
        // Speciale case if config specifically set's it's own options
        if (typeof requirement === 'object' && requirement !== null) {
          return requirement;
        }

        // Find the corresponding definition in our sources
        return props.sources.find((source) => {
          if (source.eventTypes.includes(requirement)) {
            return source;
          }

          return undefined;
        });
      })
      .sort(this.sorter)
      .filter(function (item, pos, ary) {
        if (item === undefined || !item.name) {
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
      <div className="padding-left">
        {this.state.requirements.sort(this.sorter).map((requirement) => {
          if (requirement.url) {
            return (
              <div key={requirement.name}>
                <b>
                  <SourceAvailable
                    accountId={this.props.accountId}
                    source={requirement.eventTypes}
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
  requirements: PropTypes.array,
  accountId: PropTypes.number,
};

export default InstallationInstructions;
