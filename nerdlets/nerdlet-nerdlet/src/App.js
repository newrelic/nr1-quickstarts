import React from 'react';
import {
    Switch,
    Route,
    HashRouter,
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import ScrollToTop from '../../../src/Shared/Helpers/ScrollToTop';
import ToolsTerraform from './Pages/ToolsTerraform';
import InstallNerdlet from './Pages/InstallNerdlet';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
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
