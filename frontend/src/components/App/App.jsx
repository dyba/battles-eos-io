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

    this.state = {
      loading: true
    };

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
      .catch(() => {})
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading } = this.state;
    const { user: { name, game } } = this.props;

    let appStatus = "login";

    if (game && game.status !== 0) {
      appStatus = "game-ended";
    } else if (game && game.selected_card_ai > 0) {
      appStatus = "card-selected";
    } else if (game && game.deck_ai.length !== 17) {
      appStatus = "started";
    } else if (name) {
      appStatus = "profile";
    }

    return (
      <div className={ `App status-${ appStatus }${ loading ? " loading" : "" }` }>
      { name && <Game />}
      { !name && <Login />}
      </div>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
  setUser: UserAction.setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
