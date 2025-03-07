
import React from 'react';

interface GameStatsProps {
  generation: number;
  population: number;
}

const GameStats: React.FC<GameStatsProps> = ({ generation, population }) => {
  return (
    <div className="flex justify-between mb-4 text-sm font-medium">
      <div>Generation: <span className="font-bold">{generation}</span></div>
      <div>Population: <span className="font-bold">{population}</span></div>
    </div>
  );
};

export default GameStats;
