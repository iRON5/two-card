import React from "react";
import "./player-cards.css";
import { STATUS } from "~constants";

interface PlayerCardsProps {
  round: number;
  status: string;
  player: Player;
}

export const PlayerCards: React.FC<PlayerCardsProps> = ({ status, round, player }) => {
  const looseBefore = (!!player.looseRound && round > player.looseRound);

  if (looseBefore) {
    return null;
  }

  return (
    <div className="player-cards">
      {status !== STATUS.view || !player.pairsTree ? (
        Array(7).fill(null).map((_, i) => (
          <div key={i} className="card-wrapper">
            <img src="https://github.com/htdebeer/SVG-cards/blob/master/png/1x/back.png?raw=true" className="card card-back" alt="card shirt" />
          </div>
        ))
      ) : player.pairsTree?.map(([, pairs], i) => pairs.map(pair => (
        <div key={`${player.id}_${i}`} className={pair.length === 2 ? 'cards-pair' : 'card-wrapper'}>
          {pair.map((card) => (
            <div key={card.url} className="card-wrapper">
              <img src={card.url} className="card" alt={`${card.symbol} ${card.value}`} />
            </div>
          ))}
        </div>
      )))}
    </div>
  );
};
