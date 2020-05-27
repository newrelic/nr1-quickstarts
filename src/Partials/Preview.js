import React from 'react';
import Datasource from './Datasource';
import {
    Link
  } from "react-router-dom";

class Preview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'screenshot': this.props.dashboard.screenshots[Math.floor(Math.random() * this.props.dashboard.screenshots.length)],
    };
  }

  render() {
    return (
        <div className="col-md-4 col-lg-3 col-sm-4">
            <div className="card mb-4 shadow-sm">
                <img src={ "./data/" + this.props.dashboard.name + "/" + this.state.screenshot} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">
                      <Link className="" to={"/view/" + this.props.dashboard.name}>
                        { this.props.dashboard.config.name }
                      </Link>
                    </h5>
                    <Datasource sources={this.props.dashboard.sources} />
                    <div className="d-flex justify-content-between align-items-center pt-3">
                        <small className="text-muted">Created by: { this.props.dashboard.config.author }</small>
                    </div>
                </div>
            </div>
        </div>
    );
  }

}

export default Preview;
