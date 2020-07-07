import React from 'react';
import InstallationInstructions from '../Partials/InstallationInstructions';

class ViewRequirements extends React.Component {

    constructor(props) {
        super(props);

        this.state = ViewRequirements.getState(props);
    }

    static getState(props) {
        return {
            quickstart: props.quickstart
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.quickstart || (state.quickstart.id !== props.quickstart.id)) {
            return ViewRequirements.getState(props);
        }
        return null
    }


    render() {
        return (
            <div className="overview">
                <h3>Installation instructions</h3>
                <p>This quickstart requires the following New Relic products</p>
                <InstallationInstructions sources={this.state.quickstart.sources} />

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
