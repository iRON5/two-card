import { COUNTDOWN } from "~constants";
import { compare, countdown, dealCardsForActivePlayers } from "~utils";

export const startComparison = async (
  round: number,
  players: Player[],
  dispatch: React.Dispatch<Record<string, unknown>>
) => {
  const { winners, modifiedPlayers } = compare(round, players);

  for await (const secsLeft of countdown(COUNTDOWN)) {
    dispatch({ type: 'compare', secsLeft });
  }

  if (winners.length === 1) {
    dispatch({ type: 'viewResults', winner: winners[0].id, secsLeft: 0 });
    return;
  }

  for await (const secsLeft of countdown(COUNTDOWN)) {
    dispatch({ type: 'viewResults', secsLeft });
  }

  const playersWithCards = dealCardsForActivePlayers(modifiedPlayers);

  dispatch({ type: 'restartDeal', round: round + 1, players: playersWithCards });
};
