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
  const isDrawingRef = useRef<boolean>(false);
  const lastCellRef = useRef<{x: number, y: number} | null>(null);
  const drawModeRef = useRef<boolean | null>(null);
  
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
  
  const computeNextGeneration = useCallback(() => {
    setGrid(currentGrid => {
      const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
      let aliveCount = 0;
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          let neighbors = 0;
          
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
          
          if (currentGrid[i][j]) {
            newGrid[i][j] = neighbors === 2 || neighbors === 3;
          } else {
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
  
  const toggleCell = useCallback((x: number, y: number, forcedState?: boolean) => {
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setGrid(currentGrid => {
        const newGrid = [...currentGrid.map(row => [...row])];
        
        const newState = forcedState !== undefined ? forcedState : !newGrid[y][x];
        newGrid[y][x] = newState;
        
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
  }, [gridSize]);
  
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      isDrawingRef.current = true;
      drawModeRef.current = !grid[y][x];
      toggleCell(x, y, drawModeRef.current);
      lastCellRef.current = { x, y };
    }
  }, [cellSize, gridSize, grid, toggleCell]);
  
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (lastCellRef.current && (lastCellRef.current.x !== x || lastCellRef.current.y !== y)) {
      toggleCell(x, y, drawModeRef.current);
      lastCellRef.current = { x, y };
    }
  }, [cellSize, toggleCell]);
  
  const handleCanvasMouseUp = useCallback(() => {
    isDrawingRef.current = false;
    lastCellRef.current = null;
    drawModeRef.current = null;
  }, []);
  
  const handleCanvasMouseLeave = useCallback(() => {
    isDrawingRef.current = false;
    lastCellRef.current = null;
    drawModeRef.current = null;
  }, []);
  
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
  }, []);
  
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        
        if (grid[i][j]) {
          ctx.fillStyle = 'hsl(var(--primary))';
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        } else {
          ctx.fillStyle = 'hsla(var(--background), 0.8)';
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          ctx.strokeStyle = 'hsla(var(--primary), 0.05)';
          ctx.strokeRect(x, y, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [grid, gridSize, cellSize]);
  
  const animate = useCallback((timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    if (elapsed > speed) {
      if (isRunning) {
        computeNextGeneration();
      }
      lastUpdateTimeRef.current = timestamp;
    }
    
    drawGrid();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [computeNextGeneration, drawGrid, isRunning, speed]);
  
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
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        className="bg-background/30 rounded-lg shadow-inner cursor-pointer"
      />
    </div>
  );
};

export default GameOfLife;
