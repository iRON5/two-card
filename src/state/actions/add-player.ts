import { MAX_HANDS_PAIRS, STATUS } from "~constants";
import { passCards } from "./pass-cards";
import { restartDeal } from "./restart-deal";

export const addPlayer = (
  playersCount: number,
  status: string,
  players: Player[],
  dispatch: React.Dispatch<Record<string, unknown>>,
) => {
  if (playersCount >= MAX_HANDS_PAIRS) {
    alert(`${MAX_HANDS_PAIRS} is minimal number of players`);
  }

  dispatch({ type: 'changePlayersCount', playersCount: playersCount + 1 });

  if (status === STATUS.prepare) {
    return;
  }

  passCards(players, dispatch);
  restartDeal(playersCount + 1, players, dispatch);
};
