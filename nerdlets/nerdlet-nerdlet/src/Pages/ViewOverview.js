import React from 'react';
import Datasource from '../Partials/Datasource';

class ViewOverview extends React.Component {

    constructor(props) {
        super(props);

        this.state = ViewOverview.getState(props);
    }

    static getState(props) {
        return {
            quickstart: props.quickstart
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.quickstart || (state.quickstart.id !== props.quickstart.id)) {
            return ViewOverview.getState(props);
        }
        return null
    }


    render() {
        return (
            <div className="overview">
                <h3>Description</h3>
                <p>{ this.state.quickstart.description }</p>

                <div className="row">
                    {this.state.quickstart.dashboards.map((dashboard) => {
                        return dashboard.screenshots.map((screenshot) => {
                            return (
                                <div className="col-3" key={dashboard.name + screenshot}>
                                    <img src={ "https://newrelic-experimental.github.io/quickstarts/data/" + this.state.quickstart.id + "/dashboards/" + screenshot} className="card-img-top" alt="..." />
                                </div>
                            );
                        });
                    })}
                </div>

                {this.state.quickstart.authors.length > 0 &&
                    <div>
                        <h5>Authors</h5>
                        <ul>
                        {this.state.quickstart.authors.map((author) => {
                            return ( <li key={author} >{ author }</li> )
                        })}
                        </ul>
                    </div>
                }

                <h5>Data sources</h5>
                <Datasource sources={this.state.quickstart.sources} />

            </div>
        );
    }
}

export default ViewOverview;
