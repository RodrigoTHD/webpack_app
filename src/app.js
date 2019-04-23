import App from "./core";
import logo from './webpack.svg';
import './App.scss';

//TODO: mover dinamicamente para pasta "public".
//import '../public/manifest.json';
import '../public/favicon.ico';

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
