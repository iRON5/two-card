import { createPlayers, dealCardsForActivePlayers } from "~utils";

export const restartDeal = (
  playersCount: number,
  players: Player[],
  dispatch: React.Dispatch<Record<string, unknown>>
) => {
  // repair those who loosed before
  const newPlayers = players.map(player => ({ ...player, looseRound: 0 }));

  if (playersCount > players.length) {
    newPlayers.push(...createPlayers(1));
  } else {
    newPlayers.pop();
  }

  const playersWithCards = dealCardsForActivePlayers(newPlayers);

  dispatch({ type: 'restartDeal', round: 1, players: playersWithCards });
};
