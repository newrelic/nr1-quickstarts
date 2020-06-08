import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import ExportTerraform from '../Partials/ExportTerraform';
import {
    Link
  } from "react-router-dom";

class ToolsTerraform extends React.Component {

    constructor(props) {
        super(props);

        this.convert = this.convert.bind(this);
        this.setJson = this.setJson.bind(this);

        this.state = {
            json: '',
            parsedJson: {},
            hasError: false,
            errorMessage: '',
        }
    }

    convert() {

    }

    setJson(event) {
        let json = event.target.value;
        let parsedJson = {};
        let hasError = false;
        let errorMessage = '';

        try {
            parsedJson = JSON.parse(json);
        } catch(exception) {
            hasError = true;
            errorMessage = exception.message;
        }

        this.setState({
            json,
            parsedJson,
            hasError,
            errorMessage,
        });


    }

    render() {
        return (
            <div className="album py-2">
                <div className="container" id="root">
                    <div className="row py-4">
                        <div className="col-8">
                            <h2>Terraform converter</h2>
                            <p>Convert a New Relic dashboard JSON to a Terraform template</p>
                        </div>
                        <div className="col-4 text-right">
                            <Link className="btn btn-default" to={"/"}>
                                <FontAwesomeIcon icon={faHome} /> Back to homepage
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    New Relic JSON
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <textarea className="form-control" onChange={this.setJson} value={this.state.json} rows="15"></textarea>
                                        </div>
                                        <div className="col-12 text-right pt-2">
                                            <button className="btn btn-primary" onClick={this.convert}>Convert</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 pt-4">
                            <div className="card">
                                <div className="card-header">
                                    Terraform output
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 ">
                                            {this.state.hasError &&
                                                <div className="col-12 text-danger">
                                                    {this.state.errorMessage}
                                                </div>
                                            }
                                            {!this.state.hasError && this.state.json !== '' &&
                                                <ExportTerraform json={this.state.parsedJson} />
                                            }
                                            {this.state.json === '' &&
                                                <p>Please enter your New Relic Json.</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default ToolsTerraform;
