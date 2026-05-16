
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameStats from './game/GameStats';
import GameGrid from './game/GameGrid';
import { computeNextGeneration, countAlive, createEmptyGrid } from './game/GameEngine';

interface GameOfLifeProps {
  gridSize?: number;
  cellSize?: number;
  initialPattern?: boolean[][];
  speed?: number;
  isRunning?: boolean;
  onStep?: (fn: () => void) => void;
}

const GameOfLife: React.FC<GameOfLifeProps> = ({
  gridSize = 50,
  cellSize = 12,
  initialPattern,
  speed = 100,
  isRunning = false,
  onStep,
}) => {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Initialize grid
  useEffect(() => {
    const initialGrid = createEmptyGrid(gridSize);
    
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
    setGeneration(0);
  }, [gridSize, initialPattern]);
  
  // Compute next generation
  const computeNext = useCallback(() => {
    setGrid(currentGrid => {
      const { newGrid } = computeNextGeneration(currentGrid, gridSize);
      return newGrid;
    });
    setGeneration(gen => gen + 1);
  }, [gridSize]);
  
  // Toggle cell state
  const toggleCell = useCallback((x: number, y: number, forcedState?: boolean) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setGrid(currentGrid => {
        const newGrid = [...currentGrid];
        const newRow = [...newGrid[y]];
        
        const newState = forcedState !== undefined ? forcedState : !newRow[x];
        newRow[x] = newState;
        newGrid[y] = newRow;
        
        return newGrid;
      });
    }
  }, [gridSize]);
  
  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!isRunning) return;

    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    if (elapsed > speed) {
      computeNext();
      lastUpdateTimeRef.current = timestamp;
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [computeNext, isRunning, speed]);
  
  // Setup and cleanup animation frame
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, isRunning]);

  // Expose step function to parent
  useEffect(() => {
    if (onStep) {
      onStep(computeNext);
    }
  }, [onStep, computeNext]);
  
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
