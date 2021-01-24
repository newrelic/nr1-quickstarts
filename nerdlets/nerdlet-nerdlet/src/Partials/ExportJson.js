import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    Button,
    Grid,
    GridItem,
    TextField,
    Toast,
} from 'nr1';

class ExportTerraform extends React.Component {

    constructor(props) {
        super(props);

        this.copySuccess = this.copySuccess.bind(this);

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

    copySuccess() {
        Toast.showToast({
            title: 'Copy complete',
            description: 'The JSON was copied to your clipboard.',
            type: Toast.TYPE.NORMAL
        });
    }

    render() {
        return (
            <Grid>
                <GridItem columnSpan={12}>
                    <CopyToClipboard text={this.state.output} onCopy={this.copySuccess}>
                        <Button
                            type={Button.TYPE.PLAIN}
                            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__COPY_TO}
                            className="margin-top"
                        >Copy to clipboard</Button>
                    </CopyToClipboard>
                <GridItem columnSpan={12}>
                </GridItem>
                    <TextField
                        className="custom-textfield-json"
                        label="JSON output"
                        multiline={true}
                        readOnly={true}
                        value={this.state.output}
                    />
                </GridItem>
            </Grid>

        );
    }

}

export default ExportTerraform;
