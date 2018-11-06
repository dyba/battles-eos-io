import React, { Component } from 'react';
import { Button } from '../../../../components';
import { Card } from '../';

class Resolution extends Component {

  render() {
    const {
      aiCard,
      aiName,
      aiLost,
      playerCard,
      playerName,
      playerLost,
      status,
      onNextRound,
      onEndGame
    } = this.props;

    const isCardSelected = aiCard > 0;

    let aiRoundResult = "";
    let playerRoundResult = "";

    if (aiLost === 0 && playerLost === 0) {
      aiRoundResult = "DRAW";
      playerRoundResult = "DRAW";
    } else if (aiLost === 0) {
      aiRoundResult = "WIN";
      playerRoundResult = <span>- { playerLost }</span>;
    } else {
      aiRoundResult = <span>- { aiLost }</span>;
      playerRoundResult = "WIN";
    }

    return (
      <div className={`Resolution${ isCardSelected ? " card-selected" : "" }`}>
        <div>
          { status === 1 && <div className="result win">VICTORY</div> }
          { status === -1 && <div className="result lost">DEFEATED</div> }
          <div className="player">
            <p className="round-result">{ isCardSelected && playerRoundResult }</p>
            <Card cardId={ playerCard } />
            <p className="name">{ playerName }</p>
          </div>
          <div className="vs">{ "VS" }</div>
          <div className="ai">
            <p className="round-result">{ isCardSelected && aiRoundResult }</p>
            <Card cardId={ aiCard } />
            <p className="name">{ aiName }</p>
          </div>
          <div className="buttons">
            { isCardSelected && status === 0 && <Button onClick={ onNextRound }>NEXT ROUND</Button> }
            { isCardSelected && status !== 0 && <Button onClick={ onEndGame } className="red">QUIT</Button> }
          </div>
        </div>
      </div>
    )
  }
}

export default Resolution;
