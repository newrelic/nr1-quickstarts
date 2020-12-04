import React from 'react';
import InstallationInstructions from '../Partials/InstallationInstructions';
import { Modal, HeadingText, AccountPicker, Tabs, TabsItem, JsonChart } from 'nr1'

class ViewRequirements extends React.Component {

    constructor(props) {
        super(props);

        this.onChangeAccount = this.onChangeAccount.bind(this);

        this.state = ViewRequirements.getState(props);
    }

    static getState(props) {
        return {
            quickstart: props.quickstart,
            accountId: null,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.quickstart || (state.quickstart.id !== props.quickstart.id)) {
            return ViewRequirements.getState(props);
        }
        return null
    }

    onChangeAccount(event, value) {
        this.setState({
            accountId: value
        });
    }

    render() {
        return (
            <div className="overview">
                <h3>Installation instructions</h3>
                <p>Please select an account to check the requirements against your environment.</p>

                <AccountPicker
                    value={this.state.accountId}
                    onChange={this.onChangeAccount}
                    spacingType={[AccountPicker.SPACING_TYPE.LARGE]}
                />

                <p>This quickstart requires the following data sources.</p>

                <InstallationInstructions accountId={this.state.accountId} sources={this.state.quickstart.sources} />

                {this.state.quickstart.flex.length > 0 &&
                    <div>
                        <h5>Flex configuration files</h5>
                        <ul>
                            {this.state.quickstart.flex.map((flex) => {
                                return ( <li key={flex}><a href={'./data/' + this.state.quickstart.id + '/flex/' + flex} target="_BLANK" rel="noopener noreferrer">{flex}</a></li> )
                            })}
                        </ul>
                    </div>
                }
            </div>
        );
    }
}

export default ViewRequirements;
