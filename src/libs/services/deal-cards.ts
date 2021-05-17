import shuffle from 'lodash/shuffle';
import { CARD_VALUES, CARD_SYMBOLS, DEAL_QUANTITY } from "~constants";

 const getNewPackOfCards = (): Card[] => {
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

const countFullPairs = (pairs: Card[][]) => {
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
 * Deal cards
 */
const pickCards = (packOfCards: Card[]) => {
  const pairsTree = createPairsTree();
  let pairsCount = 0;

  // create random cards and spread to groups by value
  for (let i = 0; i < DEAL_QUANTITY; i++) {
    const newCard = packOfCards.pop();

    if (!newCard) {
      throw Error('No more cards in pack!');
    }

    addNewCardOnTree(newCard, pairsTree);
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

const dealCardsForPlayer = (player: Player, packOfCards: Card[]) => {
  const deal = pickCards(packOfCards);
  const pairs = deal.pairs;

  // put pairs to the end for easier view
  const pairsTree = Array.from(deal.pairsTree).sort(([, pairsA], [, pairsB]) => (
    countFullPairs(pairsA) - countFullPairs(pairsB)
  ));

  return {
    ...player,
    pairs,
    pairsTree,
  }
};

export const dealCards = (players: Player[]) => {
  const packOfCards = getNewPackOfCards();

  return players.map(player => player.looseRound
    ? player
    : dealCardsForPlayer(player, packOfCards)
  )
};
