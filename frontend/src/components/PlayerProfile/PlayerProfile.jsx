import React, { Component } from 'react';
import Button from '../PlayerProfile';

class PlayerProfile extends Component {

  render() {
    const { name, winCount, lostCount, onStartGame } = this.props;

    return (
      <div className="PlayerProfile">
        <div className="title">Elemental Battles - powered by EOSIO</div>
        <div className="welcome">
          <span>Welcome</span>
        </div>
        <div className="username">
          <span>{ name }</span>
        </div>
        <div className="record">
          <p>Your Current Record</p>
          <span>Win <span className="count">{ winCount }</span></span>
          <span> | </span>
          <span>Lost <span className="count">{ lostCount }</span></span>
        </div>
        <div className="buttons">
          { <Button onClick={ onStartGame } className="green">START</Button> }
        </div>
      </div>
    )
  }
}

export default PlayerProfile;
