import { ActionTypes } from '../const';

const initialState = {
  name: "",
  win_count: 0,
  lost_count: 0,
  game: null
};

export default function (state = initialState, action) {
  switch (action.type) {
  case ActionTypes.SET_USER: {
    return Object.assign({}, state, {
      name: typeof action.name === "undefined" ? state.name : action.name,
      win_count: action.win_count || initialState.win_count,
      lost_count: action.lost_count || initialState.lost_count,
      game: action.game || initialState.game
    });
  }
  default:
    return state;

  }
}
