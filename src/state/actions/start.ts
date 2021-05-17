import { createPlayers, dealCards } from "~libs/services";

export const start = (
  playersCount: number,
  dispatch: React.Dispatch<Record<string, unknown>>,
) => {
  const players = createPlayers(playersCount);
  const playersWithCards = dealCards(players);

  dispatch({ type: 'restartDeal', round: 1, players: playersWithCards });
};
