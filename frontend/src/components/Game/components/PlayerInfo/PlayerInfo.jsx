import React, { Component } from 'react';

class PlayerInfo extends Component {

  render() {
    const { className, name, life } = this.props;

    return (
      <div className={`PlayerInfo${ className ? ' ' + className : '' }`}>
        <div className="name">{ name }</div>
        <div className={`life life${ life }`}></div>
        <div className="lifepoints">{ life < 0 ? 0 : life }/5</div>
      </div>
    )
  }
}

export default PlayerInfo;
