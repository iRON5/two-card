import React from 'react';
import { GameReducers, reducers } from './reducers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reducer: React.Reducer<State, any> = (state, action) => {
  const actionType: keyof GameReducers = action.type;
  const internalReducer = reducers[actionType] || (() => {
    throw new Error(`Unknown Reducer ${action.type}`);
  });

  return internalReducer(state, action);
}

export * as actions from './actions';
export * from './initial-state';
