import React from "react";
import "./player-cards.css";
import { STATUS, PAIR_BORDERS, CARD_SHIRT_URL } from "~constants";
import { CardsPair } from "~components/cards-pair";

interface PlayerCardsProps {
  round: number;
  status: string;
  player: Player;
}

export const PlayerCards: React.FC<PlayerCardsProps> = ({ status, round, player }) => {
  const looseBefore = (!!player.looseRound && round > player.looseRound);
  const borders = [...PAIR_BORDERS];

  if (looseBefore) {
    return null;
  }

  return (
    <div className="player-cards">
      {status !== STATUS.view || !player.pairsTree ? (
        Array(7).fill(null).map((_, i) => (
          <div key={i} className="card-wrapper">
            <img src={CARD_SHIRT_URL} className="card card-back" alt="card shirt" />
          </div>
        ))
      ) : player.pairsTree?.map(([, pairs], i) => pairs.map((pair, j) => (
        <CardsPair
          key={`${player.id}_${i}`}
          index={j}
          pair={pair}
          isFullPair={pair.length === 2}
          borderColor={pair.length === 2 && borders.pop() || ''}
        />
      )))}
    </div>
  );
};
