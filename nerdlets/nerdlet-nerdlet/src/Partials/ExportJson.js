import React from 'react';
import {
    Grid,
    GridItem,
    TextField,
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
                    <TextField className="custom-textfield" label="JSON output" placeholder="e.g. John Doe" multiline={true} readOnly={true} value={this.state.output} />
                </GridItem>
            </Grid>

        );
    }

}

export default ExportTerraform;
