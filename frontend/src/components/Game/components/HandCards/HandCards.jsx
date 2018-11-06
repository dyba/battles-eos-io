import React, { Component } from 'react';
import { Card } from '../';

class HandCards extends Component {

  render() {
    const { className, cards, onPlayCard } = this.props;

    const generateCards = cards => {
      let elems = [];

      for (let i = 0; i < 4; ++i) {
        let cardProperties = {
          key: i,
          cardId: cards[i]
        };

        if (onPlayCard) {
          cardProperties.onClick = () => { onPlayCard(i) };
        }

        elems.push(<Card { ...cardProperties } />);
      }

      return elems;
    };

    return (
      <div className={`HandCards${ className ? ' ' + className : '' }`}>
      { generateCards(cards) }
      </div>
    )
  }
}

export default HandCards;
