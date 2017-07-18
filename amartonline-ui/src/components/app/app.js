import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import Header from '../header/header';

class App extends Component {
  render() {
    return (
      <Grid fluid={true}>
        <Header auth={this.props.auth} />
      </Grid>
    );
  }
}

export default App;
