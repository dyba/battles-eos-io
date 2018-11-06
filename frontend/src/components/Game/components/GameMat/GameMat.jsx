import React, { Component } from 'react';
import { HandCards, PlayerInfo } from '../';

class GameMat extends Component {

  render() {
    const {
      className,
      deckCardCount,
      aiLife,
      aiHandCards,
      aiName,
      playerLife,
      playerHandCards,
      playerName,
      onPlayCard
    } = this.props;

    return (
      <table className={`GameMat${ className ? ' ' + className : '' }`}>
        <tbody>
          <tr>
            <td className="mat mat-ai">
              <PlayerInfo
                className="ai"
                name={ aiName }
                life={ aiLife }
              />
              <div className={`deck ai remain${deckCardCount}`}>
                { aiName }'S Deck ({ deckCardCount })
              </div>
              <HandCards
                className="ai"
                cards={ aiHandCards }
              />
            </td>
          </tr>
          <tr>
            <td className="mat mat-player">
              <PlayerInfo
                className="player"
                name={ playerName }
                life={ playerLife }
              />
              <div className={`deck player remain${deckCardCount}`}>
                { playerName }'S Deck ({ deckCardCount })
              </div>
              <HandCards
                className="player"
                cards={ playerHandCards }
                onPlayCard={ onPlayCard }
              />
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default GameMat;
