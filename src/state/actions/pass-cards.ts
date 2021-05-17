export const passCards = (
  players: Player[],
  dispatch: React.Dispatch<Record<string, unknown>>,
) => {
  const newPlayers = players.map(player => ({
    ...player,
    pairs: 0,
    pairsTree: undefined,
  }));

  dispatch({ type: 'prepare', players: newPlayers });
};
