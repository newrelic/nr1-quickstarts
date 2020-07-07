import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class ExportTerraform extends React.Component {

    constructor(props) {
        super(props);

        //this.copyToClipboard = this.copyToClipboard.bind(this);

        this.state = {
            output: JSON.stringify(props.json, null, '\t'),
        }
    }

    // copyToClipboard() {

    //     navigator.permissions.query({name: "clipboard-write"}).then(result => {
    //         if (result.state === "granted" || result.state === "prompt") {
    //             navigator.clipboard.writeText(this.state.output).then(function() {
    //                 alert('Terraform template copied to clipboard');
    //             }, function(error) {
    //                 console.log('error', error);
    //                 alert('Failed to copy terraform template to clipboard');
    //             });
    //         }
    //     });
    // }

    static getDerivedStateFromProps(props, state) {
        if (state.json !== props.json) {
            return {
                output: JSON.stringify(props.json, null, '\t'),
            }
        }
        return null
    }

    render() {
        return (
            <div className="terraform">
                {/* <div className="col-12 text-right">
                    <button className="btn btn-sm btn-outline-info" onClick={this.copyToClipboard}>Copy to clipboard</button>
                </div> */}
                <div className="col-12">
                    <SyntaxHighlighter language="json" style={docco}>
                        {this.state.output}
                    </SyntaxHighlighter>
                </div>
            </div>
        );
    }

}

export default ExportTerraform;
