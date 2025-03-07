
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameStats from './game/GameStats';
import GameGrid from './game/GameGrid';
import { computeNextGeneration, countAlive } from './game/GameEngine';

interface GameOfLifeProps {
  gridSize?: number;
  cellSize?: number;
  initialPattern?: boolean[][];
  speed?: number;
  isRunning?: boolean;
}

const GameOfLife: React.FC<GameOfLifeProps> = ({
  gridSize = 50,
  cellSize = 12,
  initialPattern,
  speed = 100,
  isRunning = false,
}) => {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Initialize grid
  useEffect(() => {
    const initialGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(false)
    );
    
    if (initialPattern) {
      const offsetX = Math.floor((gridSize - initialPattern.length) / 2);
      const offsetY = Math.floor((gridSize - initialPattern[0].length) / 2);
      
      for (let i = 0; i < initialPattern.length; i++) {
        for (let j = 0; j < initialPattern[i].length; j++) {
          if (offsetX + i >= 0 && offsetX + i < gridSize && 
              offsetY + j >= 0 && offsetY + j < gridSize) {
            initialGrid[offsetX + i][offsetY + j] = initialPattern[i][j];
          }
        }
      }
    }
    
    setGrid(initialGrid);
  }, [gridSize, initialPattern]);
  
  // Compute next generation
  const computeNext = useCallback(() => {
    setGrid(currentGrid => {
      const { newGrid, aliveCount } = computeNextGeneration(currentGrid, gridSize);
      setPopulation(aliveCount);
      setGeneration(gen => gen + 1);
      return newGrid;
    });
  }, [gridSize]);
  
  // Toggle cell state
  const toggleCell = useCallback((x: number, y: number, forcedState?: boolean) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setGrid(currentGrid => {
        const newGrid = [...currentGrid.map(row => [...row])];
        
        const newState = forcedState !== undefined ? forcedState : !newGrid[y][x];
        newGrid[y][x] = newState;
        
        setPopulation(countAlive(newGrid));
        
        return newGrid;
      });
    }
  }, [gridSize]);
  
  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    if (elapsed > speed) {
      if (isRunning) {
        computeNext();
      }
      lastUpdateTimeRef.current = timestamp;
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [computeNext, isRunning, speed]);
  
  // Setup and cleanup animation frame
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);
  
  const canvasSize = gridSize * cellSize;
  
  // Update population count when grid changes
  useEffect(() => {
    setPopulation(countAlive(grid));
  }, [grid]);
  
  return (
    <div className="glass-panel p-6 rounded-2xl animate-grid-fade-in">
      <GameStats generation={generation} population={population} />
      <GameGrid 
        grid={grid}
        cellSize={cellSize}
        onCellToggle={toggleCell}
        canvasSize={canvasSize}
      />
    </div>
  );
};

export default GameOfLife;
