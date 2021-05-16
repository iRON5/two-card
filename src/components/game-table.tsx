import React from "react";
import { STATUS } from "~constants";

interface GameTableProps {
  round: number;
  status: string;
  secsLeft: number;
  players: Player[];
}

export const GameTable: React.FC<GameTableProps> = ({
  round,
  status,
  secsLeft,
  players,
}) => {
  const showLoose = ({ looseRound }: Player) => (
    (status === STATUS.view && looseRound)
    || (looseRound && round > looseRound)
  );

  return (
    <section className="players">
      {players.map(player => (
        <div key={player.id} className={`player ${showLoose(player) ? 'player-loose' : ''}`}>
          <h4>{player.id}</h4>
          {(!player.looseRound || round === player.looseRound) && (
            <div className="player-cards">
              {status !== STATUS.view || !player.pairsTree ? (
                Array(7).fill(null).map((_, i) => (
                  <div key={i} className="card-wrapper">
                    <img src="https://github.com/htdebeer/SVG-cards/blob/master/png/1x/back.png?raw=true" className="card card-back" alt="card shirt" />
                  </div>
                ))
              ) : player.pairsTree!.map(([_, pairs], i) => pairs.map(pair => (
                <div key={`${player.id}_${i}`} className={pair.length === 2 ? 'cards-pair' : 'card-wrapper'}>
                  {pair.map((card, j) => (
                    <div key={card.url} className="card-wrapper">
                      <img src={card.url} className="card" alt={`${card.symbol} ${card.value}`} />
                    </div>
                  ))}
                </div>
              )))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};