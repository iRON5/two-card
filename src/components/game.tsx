import React, { useEffect } from "react";
import { STATUS } from "~constants";
import { actions, usePairGameState } from '../state';
import { GameInfo } from './game-info';
import { GameTable } from './game-table';

const useReadinessFlag = (status: string) => {
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    setReady(status !== STATUS.prepare);
  }, [status]);

  return ready;
};

interface UsePlayersCountTracker {
  (params: {
    ready: boolean;
    playersCount: number;
    players: Player[];
    dispatch: React.Dispatch<object>;
  }): void;
}

const usePlayersCountTracker: UsePlayersCountTracker = ({
  ready,
  playersCount,
  players,
  dispatch,
}) => {
  useEffect(() => {
    // ignore if game was not started or players count was not changed
    if (!ready || playersCount === players.length) {
      return;
    }

    actions.restartDeal(playersCount, players, dispatch);
  }, [playersCount, ready, players, dispatch]);
};

interface UseGameRounds {
  (params: {
    status: string;
    round: number;
    players: Player[];
    dispatch: React.Dispatch<object>;
  }): void;
}

const useGameRounds: UseGameRounds = ({
  status,
  round,
  players,
  dispatch,
}) => {
  useEffect(() => {
    // wait for countdown, cards deal or winner
    if (status !== STATUS.deal) {
      return;
    }

    actions.startComparison(round, players, dispatch);
  }, [round, players, dispatch]);
};

export const Game = () => {
  const [state, dispatch] = usePairGameState();
  const { status, winner, round, secsLeft, playersCount, players } = state;
  const ready = useReadinessFlag(status);

  const addPlayer = () => actions.addPlayer(playersCount, status, players, dispatch);
  const removePlayer = () => actions.removePlayer(playersCount, status, players, dispatch);
  const startNewGame = () => actions.start(playersCount, dispatch);

  // deal new cards on change players count
  // usePlayersCountTracker({
  //   ready,
  //   playersCount,
  //   players,
  //   dispatch,
  // });

  // start rounds
  useGameRounds({
    status,
    round,
    players,
    dispatch,
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
            status={status}
            secsLeft={secsLeft}
          />
          <GameTable
            round={round}
            status={status}
            players={players}
            secsLeft={secsLeft}
          />
        </>
      )}
    </div>
  );
};
