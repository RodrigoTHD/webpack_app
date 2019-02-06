import App from "./core";
import logo from './webpack.svg';
import './App.scss';
import '../public/favicon.ico';

//require('./app.scss');
App.render(() => {
    return (`
        <div class="App">
            <header class="App-header">
            <img src="${logo}" class="App-logo" alt="logo" />
            <p>Webpack 4 - Starter App</p>
            <a class="App-link" href="https://webpack.js.org/" target="_blank">Learn Webpack</a>
            </header>
        </div>
    `);
});
