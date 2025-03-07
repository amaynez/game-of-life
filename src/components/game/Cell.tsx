
import React from 'react';

interface CellProps {
  isAlive: boolean;
  x: number;
  y: number; 
  size: number;
  onClick: (x: number, y: number) => void;
}

const Cell: React.FC<CellProps> = ({ isAlive, x, y, size, onClick }) => {
  const handleClick = () => {
    onClick(x, y);
  };

  return (
    <div 
      style={{
        width: size - 1,
        height: size - 1,
        position: 'absolute',
        left: x * size,
        top: y * size,
      }}
      onClick={handleClick}
      className={`${isAlive ? 'bg-primary' : 'bg-background/30 border border-primary/5'}`}
    />
  );
};

export default Cell;
