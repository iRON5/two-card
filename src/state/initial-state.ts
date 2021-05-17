import { COUNTDOWN, MIN_HANDS_PAIRS, STATUS } from "~constants";

export const initialState: State = {
  round: 0,
  winner: '',
  players: [],
  secsLeft: COUNTDOWN,
  status: STATUS.prepare,
  playersCount: MIN_HANDS_PAIRS,
};
