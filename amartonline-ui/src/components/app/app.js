import React, { Component } from 'react';
import Header from '../header/header';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Header auth={this.props.auth} cart={this.props.cart} />
      </div>
    );
  }
}

export default App;
