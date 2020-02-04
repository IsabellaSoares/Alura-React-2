import React, { Component } from 'react';
import './css/timeline.css';
import Header from './components/Header';
import Timeline from './components/Timeline';

// https://instalura-api.herokuapp.com/api/public/fotos/rafael

class App extends Component {
  render () {
    return (
      <div id="root">
        <div data-reactroot="" className="main">
          <Header/>
          <Timeline/>          
        </div>
      </div>
    );
  }  
}

export default App;
