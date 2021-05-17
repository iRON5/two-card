import React, { useReducer } from 'react';
import { COUNTDOWN, MAX_HANDS_PAIRS, MIN_HANDS_PAIRS, STATUS } from './constants';
import { createPlayers, getNewPackOfCards, dealCardsForPlayer, compare, countdown } from './utils';

const dealCardsForActivePlayers = (players: Player[]) => {
  const packOfCards = getNewPackOfCards();

  return players.map(player => player.looseRound
    ? player
    : dealCardsForPlayer(player, packOfCards)
  )
};

interface State {
  round: number;
  winner: string;
  players: Player[];
  secsLeft: number;
  status: string;
  playersCount: number;
}

const initialState: State = {
  round: 0,
  winner: '',
  players: [],
  secsLeft: COUNTDOWN,
  status: STATUS.prepare,
  playersCount: MIN_HANDS_PAIRS,
};

interface Reducers {
  changePlayersCount: React.Reducer<State, { playersCount: number }>;
  restartDeal: React.Reducer<State, { round: number; players: Player[] }>;
  compare: React.Reducer<State, { secsLeft: number }>;
  viewResults: React.Reducer<State, { secsLeft?: number; winner?: string }>;
  prepare: React.Reducer<State, { players: Player[] }>;
}

const reducers: Reducers = {
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

const reducer: React.Reducer<State, any> = (state, action) => {
  const actionType: keyof Reducers = action.type;
  const internalReducer = reducers[actionType] || (() => {
    throw new Error(`Unknown Reducer ${action.type}`);
  });

  return internalReducer(state, action);
}

export const actions = {
  addPlayer(
    playersCount: number,
    status: string,
    players: Player[],
    dispatch: React.Dispatch<any>,
  ) {
    if (playersCount >= MAX_HANDS_PAIRS) {
      alert(`${MAX_HANDS_PAIRS} is minimal number of players`);
    }

    dispatch({ type: 'changePlayersCount', playersCount: playersCount + 1 });

    if (status === STATUS.prepare) {
      return;
    }

    this.passCards(players, dispatch);
    this.restartDeal(playersCount + 1, players, dispatch);
  },
  removePlayer(
    playersCount: number,
    status: string,
    players: Player[],
    dispatch: React.Dispatch<any>
  ) {
    if (playersCount <= MIN_HANDS_PAIRS) {
      alert(`${MIN_HANDS_PAIRS} is minimal number of players`);
    }

    dispatch({ type: 'changePlayersCount', playersCount: playersCount - 1 });

    if (status === STATUS.prepare) {
      return;
    }

    this.passCards(players, dispatch);
    this.restartDeal(playersCount - 1, players, dispatch);
  },
  passCards(players: Player[], dispatch: React.Dispatch<any>) {
    const newPlayers = players.map(player => ({
      ...player,
      pairs: 0,
      pairsTree: undefined,
    }));

    dispatch({ type: 'prepare', players: newPlayers });
  },
  start(playersCount: number, dispatch: React.Dispatch<any>) {
    const players = createPlayers(playersCount);
    const playersWithCards = dealCardsForActivePlayers(players);

    dispatch({ type: 'restartDeal', round: 1, players: playersWithCards });
  },
  restartDeal(
    playersCount: number,
    players: Player[],
    dispatch: React.Dispatch<any>
  ) {
    // repair those who loosed before
    const newPlayers = players.map(player => ({ ...player, looseRound: 0 }));

    if (playersCount > players.length) {
      newPlayers.push(...createPlayers(1));
    } else {
      newPlayers.pop();
    }

    const playersWithCards = dealCardsForActivePlayers(newPlayers);

    dispatch({ type: 'restartDeal', round: 1, players: playersWithCards });
  },
  async startComparison(
    round: number,
    players: Player[],
    dispatch: React.Dispatch<any>
  ) {
    const { winners, modifiedPlayers } = compare(round, players);

    for await (const secsLeft of countdown()) {
      dispatch({ type: 'compare', secsLeft });
    }

    if (winners.length === 1) {
      dispatch({ type: 'viewResults', winner: winners[0].id, secsLeft: 0 });
      return;
    }

    for await (const secsLeft of countdown()) {
      dispatch({ type: 'viewResults', secsLeft });
    }

    const playersWithCards = dealCardsForActivePlayers(modifiedPlayers);

    dispatch({ type: 'restartDeal', round: round + 1, players: playersWithCards });
  },
};

export const usePairGameState = () => useReducer(reducer, initialState);
