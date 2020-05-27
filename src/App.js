import React from 'react';
import {
    Switch,
    Route,
    HashRouter
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';

class App extends React.Component {

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/view/:handle" component={View} />
                    <Route path="/" component={Home} />
                </Switch>
            </HashRouter>
        )
    }

}

export default App;
