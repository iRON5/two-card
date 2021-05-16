import { useReducer } from 'react';
import { COUNTDOWN, MAX_HANDS_PAIRS, MIN_HANDS_PAIRS } from './constants';

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {boolean} loose
 * @property {number} pairs
 * @property {null | PairsTree} pairsTree
 */

const steps = {
  prepare: 'PREPARE',
  start: 'START',
  deal: 'DEAL_CARDS',
  waitForOpen: 'WAIT_FOR_OPEN',
  viewResults: 'VIEW_RESULTS',
  compare: 'COMPARE',
  waitForNextRound: 'WAIT_FOR_NEXT_ROUND',
};

const initialState = {
  round: 0,
  winner: '',

  /** @type {Player[]} */
  players: [],
  secsLeft: COUNTDOWN,
  step: steps.prepare,
  playersCount: MIN_HANDS_PAIRS,
};

const reducers = {
  changePlayersCount(state, action) {
    return {
      ...state,
      playersCount: action.playersCount,
    }
  },
  start(state, action) {
    return {
      ...state,
      round: 1,
      winner: '',
      step: steps.start,
      secsLeft: COUNTDOWN,
      players: action.players,
    };
  },
};

const reducer = (state, action) => {
  const internalReducer = reducers[action.type] || (() => {
    throw new Error(action);
  });

  return internalReducer(state, action);
}

export const actions = {
  addPlayer(playersCount, dispatch) {
    if (playersCount < MAX_HANDS_PAIRS) {
      dispatch({ type: 'changePlayersCount', playersCount: playersCount + 1 });
    } else {
      alert(`${MAX_HANDS_PAIRS} is minimal number of players`);
    }
  },
  removePlayer(playersCount, dispatch) {
    if (playersCount > MIN_HANDS_PAIRS) {
      dispatch({ type: 'changePlayersCount', playersCount: playersCount - 1 });
    } else {
      alert(`${MIN_HANDS_PAIRS} is minimal number of players`);
    }
  },
  start(dispatch) {
    dispatch({ type: 'start' });
  }
};

export const usePairGameState = () => {
  return useReducer(reducer, initialState);
};
