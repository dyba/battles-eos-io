import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserAction } from '../../actions';
import { ApiService } from '../../services';
import PlayerProfile from '../PlayerProfile';
import { GameInfo, GameMat } from './components';

class Game extends Component {

  constructor(props) {
    super(props);

    this.loadUser = this.loadUser.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handlePlayCard = this.handlePlayCard.bind(this);

    this.loadUser();
  }

  loadUser() {
    const { setUser, user: { name } } = this.props;

    return ApiService
      .getUserByName(name)
      .then(user => {
        setUser({
          win_count: user.win_count,
          lost_count: user.lost_count,
          game: user.game_data
        });
      });
  }

  handleStartGame() {
    return ApiService
      .startGame()
      .then(() => {
        return this.loadUser();
      })
  }

  handlePlayCard(cardIdx) {
    const { user: { game } } = this.props;

    if (game.hand_player[cardIdx] === 0) {
      return;
    }

    return ApiService
      .playCard(cardIdx)
      .then(() => {
        return this.loadUser();
      })
  }

  render() {
    const { user: { name, win_count, lost_count, game } } = this.props;

    const isGameStarted = game && game.deck_ai.length !== 17;

    return (
      <section className="Game">
        { !isGameStarted ?
          <PlayerProfile
            name={ name }
            winCount={ win_count }
            lostCount={ lost_count }
            onStartGame={ this.handleStartGame }
          />

          :

          <div className="container">
            <GameMat
              deckCardCount={ game.deck_ai.length }
              aiLife={ game.life_ai }
              aiHandCards={ game.hand_ai }
              aiName="COMPUTER"
              playerLife={ game.life_player }
              playerHandCards={ game.hand_player }
              playerName={ name }
              onPlayCard={ this.handlePlayCard }
            />
            <GameInfo
              deckCardCount={ game.deck_ai.length }
              handCardCount={ game.hand_ai.filter( x => x > 0 ).length }
            />
          </div>
        }
      </section>
    )
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
  setUser: UserAction.setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
