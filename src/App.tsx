import './App.css';

import React from 'react';

import { AppProps } from './Component1/';
import logo from './logo.svg';
import logo192 from './logo192.png';

function App() {
  const value: AppProps = { id: 'id' };
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'>
          Learn React
        </a>
        <img src={logo192} alt='logo192' />
        {value.id}
      </header>
    </div>
  );
}

export default App;
