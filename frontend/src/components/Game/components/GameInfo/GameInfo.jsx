import React, { Component } from 'react';
import { Button } from '../../../../components';

class Info extends Component {

  render() {
    const { className, deckCardCount, handCardCount, onEndGame } = this.props;

    return (
      <div className={`Info${ className ? ' ' + className : '' }`}>
        { <p>ROUND <span className="round-number">{ 18 - deckCardCount - handCardCount }/17</span></p> }
        <div><Button onClick={ onEndGame } className="small red">QUIT</Button></div>
      </div>
    )
  }
}

export default Info;
