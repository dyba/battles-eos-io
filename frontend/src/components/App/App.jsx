import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Game, Login } from 'components';
import './App.css';

class App extends Component {
  render() {
    const { user: { name } } = this.props;

    return (
      <div className="App">
        { name && <Game />}
        { !name && <Login />}
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(App);
