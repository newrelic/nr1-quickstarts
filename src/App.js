import React from 'react';
import {
    Switch,
    Route,
    HashRouter
  } from "react-router-dom";
import Home from './Pages/Home';
import View from './Pages/View';
import ScrollToTop from './Shared/Helpers/ScrollToTop';
import './style.scss';

class App extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <HashRouter>
                <main role="main">

                    <Switch>
                        <Route path="/view/:handle" component={View} />
                        <Route path="/" component={Home} />
                    </Switch>

                    <ScrollToTop />
                </main>
            </HashRouter>
        )
    }

}

export default App;
