import React from "react";
import './App.css';
import Home from './components/Home';
import News from "./components/News";

function App() {
  return (
    <div className="App">
      <div style={{height: '1000px'}}>
        <h1>Weather App</h1>
        <Home />
      </div>

      <div style={{height:'auto', marginTop:'50px'}}>
        <h2>News</h2>
        <News />
      </div>

    </div>
  );
}

export default App;
