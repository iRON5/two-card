import shuffle from 'lodash/shuffle';
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';
import { CARD_VALUES, CARD_SYMBOLS } from "~constants";

 export const getNewPackOfCards = (): Card[] => {
  return shuffle(
    CARD_SYMBOLS.map(symbol => (
      CARD_VALUES.map(value => ({
        value,
        symbol,
        url: `http://h3h.net/images/cards/${symbol}_${value}.svg`,
      }))
    )).flat()
  );
};

export const countFullPairs = (pairs: Card[][]) => {
  return pairs.reduce((acc, pair) => (
    pair.length < 2
      ? acc
      : acc + 1
  ), 0);
};

const createPairsTree = (): PairsTree => new Map(
  CARD_VALUES.map(key => [key, []])
);

const addNewCardOnTree = (card: Card, pairsTree: PairsTree) => {
  const pairs = pairsTree.get(card.value);
  const pairWithSlot = pairs?.find(pair => pair.length < 2);

  if (pairWithSlot) {
    pairWithSlot.push(card);
  } else {
    pairs?.push([card]);
  }
};

/**
 * Deal 7 cards
 */
export const pickCards = (packOfCards: Card[]) => {
  const pairsTree = createPairsTree();
  let pairsCount = 0;

  // create random cards and spread to groups by value
  for (let i = 0; i < 7; i++) {
    addNewCardOnTree(packOfCards.pop()!, pairsTree);
  }

  // clean empty branches and count pairs
  for (const [pairsName, pairs] of pairsTree) {
    pairsCount += countFullPairs(pairs);

    if (!pairs.length) {
      pairsTree.delete(pairsName);
    }
  }

  return {
    pairsTree,
    pairs: pairsCount,
  };
};

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

let timeout: any = 0;

export const countdown = function* () {
  clearTimeout(timeout);

  for (let i = 10; i >= 0; i--) {
    // eslint-disable-next-line no-loop-func
    yield new Promise((resolve) => {
      timeout = setTimeout(() => resolve(i), 1000);
    });
  }
};

export const compare = (round: number, players: Player[]) => {
  const winners = players.slice(1).reduce((winners, player) => {
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
  }, [players[0]]);

  return {
    winners,
    modifiedPlayers: players,
  };
};

export const dealCardsForPlayer = (player: Player, packOfCards: Card[]) => {
  const deal = pickCards(packOfCards);
  const pairs = deal.pairs;

  // put pairs to the end for easier view
  const pairsTree = Array.from(deal.pairsTree).sort(([_, pairsA], [__, pairsB]) => (
    countFullPairs(pairsA) - countFullPairs(pairsB)
  ));

  return {
    ...player,
    pairs,
    pairsTree,
  }
};
