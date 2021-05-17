import React from "react";
import { CARD_SHIRT_URL } from "~constants";
import './cards-pair.css';

interface CardsPairProps {
  pair: Card[];
  isFullPair: boolean;
  borderColor: string;
  index: number;
}

export const CardsPair: React.FC<CardsPairProps> = ({
  pair,
  isFullPair,
  borderColor,
  index,
}) => {
  const [activeClassName, setActiveClassName] = React.useState('');

  React.useEffect(() => {
    setActiveClassName('flip');
  }, []);

  return (
    <div
      className={`${isFullPair ? 'cards-pair' : 'card-wrapper'} card-3d-container`}
      style={{ borderColor }}
    >
      {pair.map((card, i) => (
        <div key={card.url} className={`card-wrapper card-3d-inner-flip ${activeClassName} card-3d-flip-active-${i + index}`}>
          <img
            src={CARD_SHIRT_URL}
            className="card card-back"
            alt="card shirt"
          />
          <img
            src={card.url}
            className="card card-front"
            alt={`${card.symbol} ${card.value}`}
          />
        </div>
      ))}
    </div>
  );
};
