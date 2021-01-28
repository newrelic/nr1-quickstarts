import React from 'react';
import {
    Link
  } from "react-router-dom";

class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          'screenshot': this.props.quickstart.dashboards[Math.floor(Math.random() * this.props.quickstart.dashboards.length)].screenshots[0],
        };
    }

    render() {
        return (
            <div className="col-md-3 col-lg-2 col-sm-4">
                <div className="card mb-4 shadow-sm">
                    <img src={ "https://newrelic.github.io/quickstarts/data/" + this.props.quickstart.id + "/dashboards/" + this.state.screenshot} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">
                            <Link className="" to={"/view/" + this.props.quickstart.id}>
                                { this.props.quickstart.name }
                                { this.props.quickstart.authors.length > 0 &&
                                    <span className="d-block"><small className="text-muted text-small">Created by { this.props.quickstart.authors.join(', ') }</small></span>
                                }
                            </Link>
                        </h5>
                    </div>
                </div>
            </div>
        );
    }

}

export default Preview;
