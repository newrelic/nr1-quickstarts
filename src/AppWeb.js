import React from 'react';
import {
    HashRouter
  } from "react-router-dom";
import ScrollToTop from './Helpers/ScrollToTop';
import {
    Link,
  } from "react-router-dom";
import App from './App';
import './style.scss';

class AppWeb extends React.Component {

    render() {
        return (
            <HashRouter>

                <div className="container py-4">
                    <header>
                        <Link to={"/"}>
                            <h1>New Relic Quickstarts</h1>
                        </Link>
                    </header>
                </div>

                <App />

                <ScrollToTop />
            </HashRouter>
        )
    }

}

export default AppWeb;
