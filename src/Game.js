import React from "react";
import {
  MIN_HANDS_PAIRS,
  MAX_HANDS_PAIRS,
} from "./constants";
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';

const createPlayers = (amount) => {
  const players = [];

  for (let i = 0; i < amount; i++) {
    const id = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      style: 'capital',
      separator: false,
    });

    players.push({
      id,
      cards: [],
      pairs: 0,
    });
  }

  return players;
};

export const Game = () => {
  const [players, setPlayers] = React.useState(
    createPlayers(MIN_HANDS_PAIRS),
  );

  const addPlayer = () => {
    if (players.length < MAX_HANDS_PAIRS) {
      setPlayers(createPlayers(players.length + 1));
    } else {
      alert(`${MAX_HANDS_PAIRS} is minimal number of players`);
    }
  };

  const removePlayer = () => {
    if (players.length > MIN_HANDS_PAIRS) {
      setPlayers(createPlayers(players.length - 1));
    } else {
      alert(`${MIN_HANDS_PAIRS} is minimal number of players`);
    }
  };

  return (
    <div>
      <section>
        <h4>Deal Button:</h4>
        <button className="play-button">
          Deal Cards
        </button>
      </section>
      <section>
        <h4>Players: {players.length}</h4>
        <button className="button config-button" onClick={addPlayer}>
          + player
        </button>
        <button className="button config-button" onClick={removePlayer}>
          - player
        </button>
      </section>
    </div>
  );
};
