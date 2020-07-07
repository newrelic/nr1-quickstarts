import React from 'react';
import {
    Switch,
    Route
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import ScrollToTop from '../../src/Shared/Helpers/ScrollToTop';
import ToolsTerraform from './Pages/ToolsTerraform';
import InstallNerdlet from './Pages/InstallNerdlet';

class App extends React.Component {

    constructor(props) {
        super(props);

        // Load in data from website
        fetch('http://localhost:3000/quickstarts/data.json').then((response) => response.json()).then((data) => {
            this.setState({
                data,
                loading: false,
            });
        }).catch((response) => {
            console.log(response);
        });
    }

    render() {
        if (this.state.loading) {
            return ( <p>Loading..</p> )
        }

        return (
            <HashRouter>
                <main role="main">
                    <Switch>
                        <Route path="/tools/terraform" component={ToolsTerraform} />
                        <Route path="/install-nerdlet" component={InstallNerdlet} />
                        <Route path="/view/:handle" component={View} />
                        <Route path="/" component={Home} />
                    </Switch>
                </main>

                <ScrollToTop />
            </HashRouter>

        )
    }

}

export default App;
