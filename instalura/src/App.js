import React, { Component } from 'react';
import './css/timeline.css';
import Header from './components/Header';
import Timeline from './components/Timeline';

class App extends Component {
  render () {
    return (
      <div id="root">
        <div data-reactroot="" className="main">
          <Header/>
          <Timeline login={this.props.params.login}/>          
        </div>
      </div>
    );
  }  
}

export default App;
