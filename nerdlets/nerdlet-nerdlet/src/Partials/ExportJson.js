import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    Grid,
    GridItem,
} from 'nr1';

class ExportTerraform extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            output: JSON.stringify(props.json, null, '\t'),
        }
    }

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
            <Grid>
                <GridItem columnSpan={12}>
                    <SyntaxHighlighter language="json" style={docco}>
                        {this.state.output}
                    </SyntaxHighlighter>
                </GridItem>
            </Grid>

        );
    }

}

export default ExportTerraform;
