import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const [third, setThird] = useState<string | null>(null);

  //todo: refactor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const first = params.get('first');
    const second = params.get('second');
    const third = params.get('third');

    if (first) {
      localStorage.setItem('first', first);
      setFirst(first);
    } else {
      const storedFirst = localStorage.getItem('first');
      if (storedFirst) {
        setFirst(storedFirst);
      }
    }

    if (second) {
      localStorage.setItem('second', second);
      setSecond(second);
    } else {
      const storedSecond = localStorage.getItem('second');
      if (storedSecond) {
        setFirst(storedSecond);
      }
    }

    if (third) {
      localStorage.setItem('third', third);
      setThird(third);
    } else {
      const storedThird = localStorage.getItem('third');
      if (storedThird) {
        setThird(storedThird);
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
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
