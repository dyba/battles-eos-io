import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserAction } from '../../actions';
import { ApiService } from '../../services';
import PlayerProfile from '../PlayerProfile';
import { GameInfo, GameMat, Resolution } from './components';

class Game extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.loadUser = this.loadUser.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handlePlayCard = this.handlePlayCard.bind(this);
    this.handleNextRound = this.handleNextRound.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);

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

        this.setState({ loading: false });
      });
  }

  handleStartGame() {
    return ApiService
      .startGame()
      .then(() => {
        return this.loadUser();
      })
  }

  handleNextRound() {
    return ApiService
      .nextRound()
      .then(() => {
        return this.loadUser();
      });
  }

  handleEndGame() {
    return ApiService
      .endGame()
      .then(() => {
        return this.loadUser();
      });
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
    const { loading } = this.state;
    const { user: { name, win_count, lost_count, game } } = this.props;

    const isGameStarted = game && game.deck_ai.length !== 17;

    return (
      <section className={`Game${ (loading ? " loading" : "") }`}>
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
            <Resolution
              status={ game.status}
              aiCard={ game.selected_card_ai }
              aiName="COMPUTER"
              aiLost={ game.life_lost_ai }
              playerCard={ game.selected_card_player }
              playerName={ name }
              playerLost={ game.life_lost_player }
              onNextRound={ this.handleNextRound }
              onEndGame={ this.handleEndGame }
            />
            <GameInfo
              deckCardCount={ game.deck_ai.length }
              handCardCount={ game.hand_ai.filter( x => x > 0 ).length }
              onEndGame={ this.handleEndGame }
            />
          </div>
        }
        {
          isGameStarted && loading &&
          <div className="spinner">
            <div className="image"></div>
            <div className="circles">
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
            </div>
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
