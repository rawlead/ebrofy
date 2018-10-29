import * as React from 'react';
import {hot} from 'react-hot-loader'
import {Header} from '../common';
import Home from "../home/Home";

import './index.css'


class App extends React.Component {
    render() {
        return (
            <React.Fragment>
               <Header/>

                <Home/>

                {/*<Footer/>*/}
            </React.Fragment>
        );
    }
}

export default hot(module)(App);
