import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';

export const createPlayers = (quantity: number) => {
  const players: Player[] = [];

  for (let i = 0; i < quantity; i++) {
    const id = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      style: 'capital',
      separator: ' ',
    });

    players.push({
      id,
      pairs: 0,
      looseRound: 0,
      pairsTree: undefined,
    });
  }

  return players;
};
