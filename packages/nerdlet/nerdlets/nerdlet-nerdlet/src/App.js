import React from 'react';
import {
    Switch,
    Route,
    HashRouter,
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import ScrollToTop from './Helpers/ScrollToTop';
import ToolsTerraform from './Pages/ToolsTerraform';
import Tools from './Pages/Tools';
import { Spinner } from 'nr1';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: undefined,
        }
    }

    componentDidMount() {
        fetch('https://newrelic-experimental.github.io/quickstarts/data.json')
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    loading: false,
                    data: response
                })
            })
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center loading">
                            <p>Loading</p>
                            <Spinner />
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <HashRouter>
                <main role="main" id="root">
                    <Switch>
                        <Route path="/tools/terraform" render={(props) => <ToolsTerraform data={this.state.data} {...props} /> } />
                        <Route path="/view/:handle" render={(props) => <View data={this.state.data} {...props} /> } />
                        <Route path="/tools" render={(props) => <Tools data={this.state.data} {...props} /> } />
                        <Route path="/" render={(props) => <Home data={this.state.data} {...props} /> } />
                    </Switch>
                </main>

                <ScrollToTop />
            </HashRouter>

        )
    }

}

export default App;
