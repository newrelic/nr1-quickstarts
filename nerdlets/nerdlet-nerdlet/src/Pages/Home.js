import React from 'react';
import Preview from '../Partials/Preview';
import DatasourceItem from '../Partials/DatasourceItem';
import { Link } from "react-router-dom";
import {
    Button,
    Grid,
    GridItem,
    TextField,
    HeadingText,
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
                <Grid>
                    <GridItem columnSpan={3}>
                        <HeadingText type={HeadingText.TYPE.HEADING_1} className="padding-top padding-bottom">Quickstarts</HeadingText>
                        <p>Welcome to the New Relic dashboard library. </p>

                        <p>Use the search bar below to find a specific dashboard and click on any to get a more detailed description. If you want to add more dashboards or contribute to the code, please check out our <a href="https://github.com/newrelic-experimental/quickstarts" rel="noopener noreferrer" target="_BLANK">Github repository</a></p>

                        <HeadingText type={HeadingText.TYPE.HEADING_3} className="padding-top">Search</HeadingText>
                        <TextField className="custom-textfield" placeholder="Search" type={TextField.TYPE.SEARCH} onChange={this.setSearch} spacingType={[TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE, TextField.SPACING_TYPE.LARGE, TextField.SPACING_TYPE.NONE]} />

                        <HeadingText type={HeadingText.TYPE.HEADING_3} className="padding-top">Links</HeadingText>
                        <ul className="links">
                            <li><a href="https://github.com/newrelic-experimental/quickstarts/discussions" target="_BLANK"rel="noopener noreferrer">Community</a></li>
                            <li><a href="https://github.com/newrelic-experimental/quickstarts/issues/new/choose" target="_BLANK"rel="noopener noreferrer">Report idea or issue</a></li>
                            <li><a href="https://github.com/newrelic-experimental/quickstarts/" target="_BLANK"rel="noopener noreferrer">Github repository</a></li>
                            <li className="padding-top"><Link to={"/tools"}>Export helper</Link></li>
                        </ul>
                    </GridItem>
                    <GridItem columnSpan={9}>
                        <Grid className="list-view">
                            {this.props.data.quickstarts.filter(this.search).map((quickstart, i) => {
                                return (<Preview key={quickstart.name} quickstart={quickstart} />)
                            })}
                        </Grid>
                    </GridItem>
                </Grid>
            </>
        );
    }

}

export default Home;
