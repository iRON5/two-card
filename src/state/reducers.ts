/**
 * The functions are too small and simple
 * to decompose them for now
 */

import { STATUS } from "~constants";

export interface GameReducers {
  changePlayersCount: React.Reducer<State, { playersCount: number }>;
  restartDeal: React.Reducer<State, { round: number; players: Player[] }>;
  compare: React.Reducer<State, { secsLeft: number }>;
  viewResults: React.Reducer<State, { secsLeft?: number; winner?: string }>;
  prepare: React.Reducer<State, { players: Player[] }>;
}

export const reducers: GameReducers = {
  prepare(state, action) {
    return {
      ...state,
      status: STATUS.prepare,
      players: action.players,
    };
  },
  changePlayersCount(state, action) {
    return {
      ...state,
      playersCount: action.playersCount,
    }
  },
  restartDeal(state, action) {
    return {
      ...state,
      winner: '',
      round: action.round,
      status: STATUS.deal,
      players: action.players,
    };
  },
  compare(state, action) {
    return {
      ...state,
      status: STATUS.compare,
      secsLeft: action.secsLeft,
    };
  },
  viewResults(state, action) {
    return {
      ...state,
      status: STATUS.view,
      winner: action.winner || '',
      secsLeft: 'secsLeft' in action && action.secsLeft || state.secsLeft,
    };
  },
};
