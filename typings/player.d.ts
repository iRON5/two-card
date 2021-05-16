interface Player {
  id: string;
  looseRound: number;
  pairs: number;
  pairsTree?: [string, Card[][]][];
}
