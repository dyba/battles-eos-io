import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserAction } from '../../actions';
import { ApiService } from '../../services';
import PlayerProfile from '../PlayerProfile';

class Game extends Component {

  constructor(props) {
    super(props);
    this.loadUser = this.loadUser.bind(this);
    this.loadUser();
  }

  loadUser() {
    const { setUser, user: { name } } = this.props;

    return ApiService
      .getUserByName(name)
      .then(user => {
        setUser({
          win_count: user.win_count,
          lost_count: user.lost_count
        });
      });
  }

  render() {
    const { user: { name, win_count, lost_count } } = this.props;

    return (
      <section className="Game">
        <PlayerProfile
          name={ name }
          winCount={ win_count }
          lostCount={ lost_count }
        />
      </section>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
  setUser: UserAction.setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
