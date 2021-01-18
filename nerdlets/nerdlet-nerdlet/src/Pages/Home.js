import React from 'react';
import Preview from '../Partials/Preview';
import DatasourceItem from '../Partials/DatasourceItem';
import { Link } from "react-router-dom";
import {
    Button,
    Grid,
    GridItem,
    TextField,
} from "nr1";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search: '',
        }

        this.setSearch = this.setSearch.bind(this);
        this.search = this.search.bind(this);
    }

    setSearch(event, value) {
        this.setState({
            search: event.target.value
        })
    }

    search(element) {
        let lowercaseSearch = this.state.search.toLowerCase();
        if (element.name.toLowerCase().includes(lowercaseSearch)) {
            return true;
        }

        let sources = element.sources.map(value => DatasourceItem.getProduct(value));
        if (sources.toString().toLowerCase().includes(lowercaseSearch)) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <>
                <Grid className="padding-bottom padding-top">
                    <GridItem columnSpan={9}>
                        <p>Use the search bar below to find a specific dashboard and click on any to get a more detailed description. If you want to add more dashboards or contribute to the code, please check out our <a href="https://github.com/newrelic-experimental/quickstarts" rel="noopener noreferrer" target="_BLANK">Github repository</a>.</p>
                    </GridItem>
                    <GridItem columnSpan={3} className="text-right">
                        <Link to={"/tools"}>
                            <Button
                                type={Button.TYPE.NORMAL}
                                iconType={Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__NOTES__A_ADD}
                            >Tools</Button>
                        </Link>
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <TextField className="custom-textfield" placeholder="Search" type={TextField.TYPE.SEARCH} onChange={this.setSearch} spacingType={[TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE, TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE]} />
                    </GridItem>
                </Grid>
                <Grid className="list-view">
                    {this.props.data.quickstarts.filter(this.search).map((quickstart, i) => {
                        return (<Preview key={quickstart.name} quickstart={quickstart} />)
                    })}
                </Grid>
            </>
        );
    }

}

export default Home;
