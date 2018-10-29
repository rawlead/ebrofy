import * as React from 'react';
import './app/index.css';
import App from "./app/App";
import {render} from "react-dom";

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
render(<App/>,root);