import { createPlayers, dealCards } from "~libs/services";

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

  const playersWithCards = dealCards(newPlayers);

  dispatch({ type: 'restartDeal', round: 1, players: playersWithCards });
};
