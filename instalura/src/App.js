import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import PropTypes from 'prop-types';

class App extends Component {
  render() {    
    return (
    <div id="root">
      <div className="main">
        <Header store={this.context.store}/>
        <Timeline login={this.props.params.login}/>
      </div>
    </div>
    );
  }
}

App.contextTypes = {
  store: PropTypes.object.isRequired
}

export default App;