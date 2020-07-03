import React from 'react';
import {
    HashRouter
  } from "react-router-dom";
import ScrollToTop from './Helpers/ScrollToTop';
import App from './App';
import './style.scss';

class AppNerdlet extends React.Component {

    render() {
        return (
            <HashRouter>
                <App />

                <ScrollToTop />
            </HashRouter>
        )
    }

}

export default AppNerdlet;
