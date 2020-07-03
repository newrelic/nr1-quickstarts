import React from 'react';
import {
    Switch,
    Route
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import ScrollToTop from './Helpers/ScrollToTop';
import ToolsTerraform from './Pages/ToolsTerraform';

class App extends React.Component {

    render() {
        return (
            <main role="main">

                <Switch>
                    <Route path="/tools/terraform" component={ToolsTerraform} />
                    <Route path="/view/:handle" component={View} />
                    <Route path="/" component={Home} />
                </Switch>

                <ScrollToTop />
            </main>
        )
    }

}

export default App;
