import React from 'react';
import Preview from '../Partials/Preview';
import data from '../data.json';
import DatasourceItem from '../Partials/DatasourceItem';

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
            <div>
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1>New Relic - Quick start library</h1>
                        <p className="lead text-muted">Library of curated dashboards & alerts with their dependencies.</p>
                    </div>

                    <div className="container" id="root">
                        <div className="row pt-5">
                            <input type="text" className="form-control" id="search" aria-describedby="search" placeholder="Search for specific datasource or technology" value={this.state.search} onChange={this.setSearch} />
                        </div>
                    </div>
                </section>

                <div className="album bg-light">
                    <div className="container-fluid" id="root">
                        <div className="row py-3">
                        {data.quickstarts.filter(this.search).map((quickstart, i) => {
                            return (<Preview key={quickstart.name} quickstart={quickstart} />)
                        })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Home;
