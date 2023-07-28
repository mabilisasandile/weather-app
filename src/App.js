import React from "react";
import './App.css';
import Home from './components/Home';
import News from "./components/News";

function App() {
  return (
    <div className="App">
        <h1>Weather App</h1>
        <Home />
        <br></br>
        <br></br>
        <h2>News</h2>
        <News />
    </div>
  );
}

export default App;
