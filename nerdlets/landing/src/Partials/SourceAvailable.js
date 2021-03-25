import React from 'react';
import { NrqlQuery, Icon, Tooltip, Spinner } from 'nr1';
import PropTypes from 'prop-types';

class SourceAvailable extends React.Component {
  render() {
    if (this.props.accountId && this.props.source) {
      return (
        <NrqlQuery
          accountId={this.props.accountId}
          query={`SELECT count(*) FROM ${this.props.source.join(
            ','
          )} SINCE 60 minutes ago LIMIT 1`}
        >
          {({ loading, data }) => {
            if (loading) {
              return <Spinner inline />;
            }

            if (
              data &&
              data.length > 0 &&
              data[0].data.length > 0 &&
              data[0].data[0].count > 0
            ) {
              return (
                <Tooltip text="Requirement fulfilled!">
                  <Icon
                    className="text-green"
                    type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK}
                  />
                </Tooltip>
              );
            } else {
              return (
                <Tooltip text="Requirement missing, check out the installation instructions below">
                  <Icon
                    className="text-red"
                    type={Icon.TYPE.INTERFACE__SIGN__EXCLAMATION__V_ALTERNATE}
                  />
                </Tooltip>
              );
            }
          }}
        </NrqlQuery>
      );
    }
    return null;
  }
}

SourceAvailable.propTypes = {
  accountId: PropTypes.number,
  source: PropTypes.array,
};

export default SourceAvailable;
