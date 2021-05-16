import React, { useEffect } from "react";
import {
  COUNTDOWN,
  CARD_VALUES,
  CARD_SYMBOLS,
  MIN_HANDS_PAIRS,
  MAX_HANDS_PAIRS,
} from "./constants";
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';
import shuffle from 'lodash/shuffle';
import { actions, usePairGameState } from './state';

/**
 * @typedef {object} Card
 * @property {string} url
 * @property {string} value
 * @property {string} symbol
 */

/**
 * @typedef {Map<string, Card[][]>} PairsTree
 */

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {boolean} loose
 * @property {number} pairs
 * @property {null | PairsTree} pairsTree
 */

/**
 * @returns {Card[]}
 */
const getNewPackOfCards = () => {
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

/**
 * @param {Card[][]} pairs
 */
const countFullPairs = (pairs) => {
  return pairs.reduce((acc, pair) => (
    pair.length === 2 ? (acc + 1) : acc
  ), 0);
};

/**
 * @returns {PairsTree}
 */
const createPairsTree = () => new Map(
  CARD_VALUES.map(key => [key, []])
);

/**
 * @param {PairsTree} pairsTree
 */
const addNewCardOnTree = (card, pairsTree) => {
  const pairs = pairsTree.get(card.value);
  const pairWithSlot = pairs.find(pair => pair.length < 2);

  if (pairWithSlot) {
    pairWithSlot.push(card);
  } else {
    pairs.push([card]);
  }
};

/**
 * Deal 7 cards
 *
 * @param {Card[]}
 */
const dealCardsToPlayer = (packOfCards) => {
  const pairsTree = createPairsTree();
  let pairsCount = 0;

  // create random cards and spread to groups by value
  for (let i = 0; i < 7; i++) {
    addNewCardOnTree(packOfCards.pop(), pairsTree);
  }

  // clean empty branches and count pairs
  for (let [pairsName, pairs] of pairsTree) {
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

/**
 * @param {number} quantity
 */
const createPlayers = (quantity) => {
  /** @type {Player[]} */
  const players = [];

  for (let i = 0; i < quantity; i++) {
    const id = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      style: 'capital',
      separator: ' ',
    });

    players.push({
      id,
      pairs: 0,
      loose: false,
      pairsTree: null,
    });
  }

  return players;
};

let timeout = 0;

const countdown = (secsLeft, setSecsLeft) => {
  clearTimeout(timeout);
  setSecsLeft(secsLeft);

  if (secsLeft === 0) {
    return;
  }

  timeout = setTimeout(() => {
    countdown(secsLeft - 1, setSecsLeft);
  }, 1000);
};

const startNewRound = (players) => {
  const winners = players.slice(1).reduce((winners, player) => {
    if (player.pairs === winners[0].pairs) {
      return winners.concat(player);
    }

    if (player.pairs > winners[0].pairs) {
      winners.forEach(winner => winner.loose = true);

      return [player];
    }

    player.loose = true;

    return winners;
  }, [players[0]]);

  return {
    winners,
    modifiedPlayers: players,
  };
};

/**
 * @typedef {object} GameInfoProps
 * @property {number} round
 * @property {number} secsLeft
 * @property {string} winner
 */

/**
 * @type {React.FC<GameInfoProps>} props
 */
const GameInfo = ({ round, secsLeft, winner }) => {
  return (
    <section>
      <h2>Round {round}</h2>
      {!!secsLeft && <h3>Open in {secsLeft} sec(s)</h3>}
      {winner && <h2>{winner} Wins!</h2>}
    </section>
  )
};

/**
 * @typedef {object} GameTableProps
 * @property {number} secsLeft
 * @property {Player[]} players
 */

/**
 * @type {React.FC<GameTableProps>} props
 */
const GameTable = ({
  secsLeft,
  players,
}) => {
  return (
    <section className="players">
      {players.map(player => (
        <div key={player.id} className={`player ${player.loose ? 'player-loose' : ''}`}>
          <h4>{player.id}</h4>
          <div className="player-cards">
            {secsLeft ? (
              Array(7).fill(null).map((_, i) => (
                <div key={i} className="card-wrapper">
                  <img src="https://github.com/htdebeer/SVG-cards/blob/master/png/1x/back.png?raw=true" className="card card-back" alt="card shirt" />
                </div>
              ))
            ) : player.pairsTree.map(([_, pairs], i) => pairs.map(pair => (
              <div key={Math.random()} className={pair.length === 2 ? 'cards-pair' : 'card-wrapper'}>
                {pair.map(card => (
                  <div key={i} className="card-wrapper">
                    <img key={card.url} src={card.url} className="card" alt={`${card.symbol} ${card.value}`} />
                  </div>
                ))}
              </div>
            )))}
          </div>
        </div>
      ))}
    </section>
  );
};

/**
 * @param {Player} player
 * @param {Card[]} packOfCards
 */
const getPlayerWithCards = (player, packOfCards) => {
  const deal = dealCardsToPlayer(packOfCards);
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

const useReadinessFlag = (round, secsLeft) => {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    if (round > 0 || !secsLeft) {
      setReady(true);
    }
  }, [secsLeft, round]);

  return ready;
};

const usePlayersCountTracker = ({
  ready,
  playersCount,
  players,
  setSecsLeft,
  setWinner,
  setRound,
  dealCards,
}) => {
  useEffect(() => {
    // ignore if game was not started or players count was not changed
    if (!ready || playersCount === players.length) {
      return;
    }

    // repair those who loosed before
    const newPlayers = players.map(player => ({ ...player, loose: false }));

    if (playersCount > players.length) {
      newPlayers.push(...createPlayers(1));
    } else {
      newPlayers.pop();
    }

    // deal cards and start new game
    countdown(COUNTDOWN, setSecsLeft);
    setWinner('');
    setRound(1);
    dealCards(newPlayers);
  }, [playersCount, ready, players, dealCards]);
};

const useGameRounds = ({
  winner,
  round,
  secsLeft,
  players,
  setSecsLeft,
  setWinner,
  setRound,
  dealCards,
}) => {
  useEffect(() => {
    // wait for countdown, cards deal or winner
    if (winner || secsLeft > 0 || !players[0].pairsTree) {
      return;
    }

    const playersLeft = players.filter(({ loose }) => !loose);
    const { winners, modifiedPlayers } = startNewRound(playersLeft);

    if (winners.length === 1) {
      setWinner(winners[0].id);
    } else {
      setRound(round + 1);
      countdown(COUNTDOWN, setSecsLeft);
      dealCards(modifiedPlayers);
    }
  }, [secsLeft, round, players, dealCards, winner]);
};

export const Game = () => {
  const [winner, setWinner] = React.useState('');
  const [round, setRound] = React.useState(0);
  const [secsLeft, setSecsLeft] = React.useState(COUNTDOWN);
  // const [playersCount, setPlayersCount] = React.useState(MIN_HANDS_PAIRS);
  /** @type {[Player[], (player: Player[]) => void]} */
  const [players, setPlayers] = React.useState([]);
  const ready = useReadinessFlag(round, secsLeft);
  const [{ playersCount }, dispatch] = usePairGameState();

  const addPlayer = () => actions.addPlayer(playersCount, dispatch);
  const removePlayer = () => actions.removePlayer(playersCount, dispatch);

  const dealCards = React.useCallback((newPlayers) => {
    const playersToProcess = newPlayers || players;
    const packOfCards = getNewPackOfCards();
    const playersWithCards = playersToProcess.map(player => player.loose
      ? player
      : getPlayerWithCards(player, packOfCards)
    );

    setPlayers([...playersWithCards]);
  }, [players]);

  const startNewGame = () => {
    const newPlayers = createPlayers(playersCount);

    countdown(COUNTDOWN, setSecsLeft);
    setRound(1);
    setWinner('');
    dealCards(newPlayers);
  };

  // deal new cards on change players count
  usePlayersCountTracker({
    ready,
    playersCount,
    players,
    setSecsLeft,
    setWinner,
    setRound,
    dealCards,
  });

  // start rounds
  useGameRounds({
    winner,
    round,
    secsLeft,
    players,
    setSecsLeft,
    setWinner,
    setRound,
    dealCards,
  });

  return (
    <div>
      <section>
        <h4>Deal Button:</h4>
        <button className="play-button" onClick={startNewGame}>
          Deal Cards
        </button>
      </section>
      <section>
        <h4>Players: {playersCount}</h4>
        <button className="button config-button" onClick={addPlayer}>
          + player
        </button>
        <button className="button config-button" onClick={removePlayer}>
          - player
        </button>
      </section>
      {ready && (
        <>
          <GameInfo
            round={round}
            winner={winner}
            secsLeft={secsLeft}
          />
          <GameTable
            secsLeft={secsLeft}
            players={players}
          />
        </>
      )}
    </div>
  );
};
