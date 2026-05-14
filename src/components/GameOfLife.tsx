
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
  const [gameState, setGameState] = useState<{
    grid: boolean[][];
    generation: number;
    population: number;
  }>({
    grid: [],
    generation: 0,
    population: 0,
  });

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
    
    setGameState({
      grid: initialGrid,
      population: countAlive(initialGrid),
      generation: 0,
    });
  }, [gridSize, initialPattern]);
  
  // Compute next generation
  const computeNext = useCallback(() => {
    setGameState(prev => {
      const { newGrid, aliveCount } = computeNextGeneration(prev.grid, gridSize);
      return {
        grid: newGrid,
        population: aliveCount,
        generation: prev.generation + 1,
      };
    });
  }, [gridSize]);
  
  // Toggle cell state
  const toggleCell = useCallback((x: number, y: number, forcedState?: boolean) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setGameState(prev => {
        const oldState = prev.grid[y][x];
        const newState = forcedState !== undefined ? forcedState : !oldState;
        
        if (newState === oldState) return prev;
        
        const newGrid = [...prev.grid];
        newGrid[y] = [...prev.grid[y]];
        newGrid[y][x] = newState;
        
        return {
          ...prev,
          grid: newGrid,
          population: newState ? prev.population + 1 : prev.population - 1,
        };
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
  
  return (
    <div className="glass-panel p-6 rounded-2xl animate-grid-fade-in">
      <GameStats generation={gameState.generation} population={gameState.population} />
      <GameGrid 
        grid={gameState.grid}
        cellSize={cellSize}
        onCellToggle={toggleCell}
        canvasSize={canvasSize}
      />
    </div>
  );
};

export default GameOfLife;
