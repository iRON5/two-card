import React from "react";
import './game-table.css';
import { STATUS } from "~constants";
import { PlayerCards } from "~components/player-cards";

interface GameTableProps {
  round: number;
  status: string;
  players: Player[];
}

export const GameTable: React.FC<GameTableProps> = ({
  round,
  status,
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
          <PlayerCards round={round} status={status} player={player} />
        </div>
      ))}
    </section>
  );
};