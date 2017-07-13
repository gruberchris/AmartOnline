import React, { Component } from 'react';
import Navbar from '../navbar/navbar';
import Home from '../home/home';
import Auth from './auth/auth';
import { Switch, Route } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';

const auth = new Auth();

class App extends Component {
  login() {
    auth.login();
  }

  render() {
    return (
      <div>
        <Navbar auth={auth}/>
        <Grid>
          <Row className="show-grid">
            <Col md={10}>
              <Switch>
                <Route exact path="/" component={Home}/>
              </Switch>
            </Col>
            <Col md={2}>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
