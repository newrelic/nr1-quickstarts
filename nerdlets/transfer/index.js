import React from 'react';
import { NerdletStateContext } from 'nr1';
import Transfer from './Transfer';

class TransferNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <Transfer
            sourceGuid={nerdletState.dashboardGuid}
            sourceUrl={nerdletState.dashboardUrl}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

export default TransferNerdlet;
