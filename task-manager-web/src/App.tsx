// import React from 'react';
import logo from './logo.svg';
import tmLogo from './favicon-32x32.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className='Banner-header'>
        <img src={tmLogo} alt="TM"/>
      </header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>I've added a field.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
