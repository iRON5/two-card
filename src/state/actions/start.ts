import { createPlayers, dealCardsForActivePlayers } from "~utils";

export const start = (
  playersCount: number,
  dispatch: React.Dispatch<Record<string, unknown>>,
) => {
  const players = createPlayers(playersCount);
  const playersWithCards = dealCardsForActivePlayers(players);

  dispatch({ type: 'restartDeal', round: 1, players: playersWithCards });
};
