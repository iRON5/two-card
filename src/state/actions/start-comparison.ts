import { COUNTDOWN } from "~constants";
import { countdown } from "~libs/utils";
import { dealCards } from "~libs/services/deal-cards";

const compareWithPrevious = (
  round: number,
  player: Player,
  winners: Player[],
) => {
  // skip first check if first player already loose
  if (winners[0].looseRound) {
    return [player];
  }

  // skip player which already loosed
  if (player.looseRound) {
    return winners;
  }

  if (player.pairs === winners[0].pairs) {
    return winners.concat(player);
  }

  if (player.pairs > winners[0].pairs) {
    winners.forEach(winner => winner.looseRound = round);

    return [player];
  }

  player.looseRound = round;

  return winners;
};

const comparePairs = (round: number, players: Player[]) => {
  const winners = players.slice(1).reduce((winners, player) => {
    return compareWithPrevious(round, player, winners);
  }, [players[0]]);

  return {
    winners,
    modifiedPlayers: players,
  };
};

export const startComparison = async (
  round: number,
  players: Player[],
  dispatch: React.Dispatch<Record<string, unknown>>
) => {
  const { winners, modifiedPlayers } = comparePairs(round, players);

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

  const playersWithCards = dealCards(modifiedPlayers);

  dispatch({ type: 'restartDeal', round: round + 1, players: playersWithCards });
};
