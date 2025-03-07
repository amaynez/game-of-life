
import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Initialize the grid
  useEffect(() => {
    const initialGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(false)
    );
    
    // Apply initial pattern if provided
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
  
  // Calculate next generation based on Game of Life rules
  const computeNextGeneration = useCallback(() => {
    setGrid(currentGrid => {
      const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
      let aliveCount = 0;
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let neighbors = 0;
          
          // Check all 8 neighbors
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) continue;
              
              const newI = (i + x + gridSize) % gridSize;
              const newJ = (j + y + gridSize) % gridSize;
              
              if (currentGrid[newI][newJ]) {
                neighbors++;
              }
            }
          }
          
          // Apply Conway's rules
          if (currentGrid[i][j]) {
            // Any live cell with 2 or 3 live neighbors survives
            newGrid[i][j] = neighbors === 2 || neighbors === 3;
          } else {
            // Any dead cell with exactly 3 live neighbors becomes alive
            newGrid[i][j] = neighbors === 3;
          }
          
          if (newGrid[i][j]) {
            aliveCount++;
          }
        }
      }
      
      setPopulation(aliveCount);
      setGeneration(gen => gen + 1);
      return newGrid;
    });
  }, [gridSize]);
  
  // Handle cell clicking (toggle state)
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setGrid(currentGrid => {
        const newGrid = [...currentGrid.map(row => [...row])];
        newGrid[y][x] = !newGrid[y][x];
        
        // Update population when toggling cells
        let aliveCount = 0;
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            if (newGrid[i][j]) aliveCount++;
          }
        }
        setPopulation(aliveCount);
        
        return newGrid;
      });
    }
  }, [cellSize, gridSize]);
  
  // Draw the grid on canvas
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        
        if (grid[i][j]) {
          // Alive cell
          ctx.fillStyle = 'hsl(var(--primary))';
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        } else {
          // Dead cell - just draw a subtle border
          ctx.fillStyle = 'hsla(var(--background), 0.8)';
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          ctx.strokeStyle = 'hsla(var(--primary), 0.05)';
          ctx.strokeRect(x, y, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [grid, gridSize, cellSize]);
  
  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    // Update at specified speed
    if (elapsed > speed) {
      if (isRunning) {
        computeNextGeneration();
      }
      lastUpdateTimeRef.current = timestamp;
    }
    
    drawGrid();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [computeNextGeneration, drawGrid, isRunning, speed]);
  
  // Start/Stop animation based on isRunning prop
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
  
  // Calculate actual canvas size
  const canvasSize = gridSize * cellSize;
  
  // Count population on initial render
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j]) count++;
      }
    }
    setPopulation(count);
  }, [grid]);
  
  return (
    <div className="glass-panel p-6 rounded-2xl animate-grid-fade-in">
      <div className="flex justify-between mb-4 text-sm font-medium">
        <div>Generation: <span className="font-bold">{generation}</span></div>
        <div>Population: <span className="font-bold">{population}</span></div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        onClick={handleCanvasClick}
        className="bg-background/30 rounded-lg shadow-inner cursor-pointer"
      />
    </div>
  );
};

export default GameOfLife;
