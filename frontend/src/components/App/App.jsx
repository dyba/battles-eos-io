import React, { Component } from 'react';
import { connect } from 'react-redux';
/* import { Game, Login } from '../components'; */
import Game from '../Game';
import Login from '../Login';
import './App.css';
import { UserAction } from '../../actions';
import { ApiService } from '../../services';

class App extends Component {

  constructor(props) {
    super(props);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getCurrentUser();
  }

  getCurrentUser() {
    const { setUser } = this.props;
    return ApiService
      .getCurrentUser()
      .then(username => {
        setUser({ name: username })
      })
      .catch(() => {});
  }

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

const mapDispatchToProps = {
  setUser: UserAction.setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
