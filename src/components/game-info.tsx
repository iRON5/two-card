import React from 'react';
import { STATUS } from '~constants';

interface GameInfoProps {
  status: string;
  round: number;
  secsLeft: number;
  winner: string;
}

 export const GameInfo: React.FC<GameInfoProps> = ({ status, round, secsLeft, winner }) => {
  return (
    <section>
      <h2>Round {round}</h2>
      {status === STATUS.compare && !!secsLeft && <h3>Open in {secsLeft} sec(s)</h3>}
      {!winner && status === STATUS.view && !!secsLeft && <h3>Next round will start in {secsLeft} sec(s)</h3>}
      {winner && <h2>{winner} Wins!</h2>}
    </section>
  )
};
