import React from 'react';
import Datasource from './Datasource';
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
        <div className="col-md-4 col-lg-3 col-sm-4">
            <div className="card mb-4 shadow-sm">
                <img src={ "./data/" + this.props.quickstart.id + "/dashboards/" + this.state.screenshot} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">
                      <Link className="" to={"/view/" + this.props.quickstart.id}>
                        { this.props.quickstart.name } <small className="text-muted text-small">created by { this.props.quickstart.authors.join(', ') }</small>
                      </Link>
                    </h5>
                    <Datasource sources={this.props.quickstart.sources} />
                    <div className="d-flex justify-content-between align-items-center pt-3">

                    </div>
                </div>
            </div>
        </div>
    );
  }

}

export default Preview;
