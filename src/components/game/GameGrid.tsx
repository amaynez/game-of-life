
import React, { useRef, useEffect, useCallback } from 'react';

interface GameGridProps {
  grid: boolean[][];
  cellSize: number;
  onCellToggle: (x: number, y: number, forcedState?: boolean) => void;
  canvasSize: number;
}

const GameGrid: React.FC<GameGridProps> = ({ grid, cellSize, onCellToggle, canvasSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastCellRef = useRef<{x: number, y: number} | null>(null);
  const drawModeRef = useRef<boolean | null>(null);

  // Canvas drawing function
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rows = grid.length;
    const cols = grid[0]?.length || 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Pre-calculate colors and drawing parameters
    const primaryColor = 'hsl(var(--primary))';
    const bgColor = 'hsla(var(--background), 0.8)';
    const strokeColor = 'hsla(var(--primary), 0.05)';
    const size = cellSize - 1;

    // First pass: Draw all background cells and grid lines
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        
        if (!grid[i][j]) {
          ctx.fillRect(x, y, size, size);
          ctx.strokeRect(x, y, size, size);
        }
      }
    }

    // Second pass: Draw only alive cells to minimize fillStyle changes
    ctx.fillStyle = primaryColor;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j]) {
          const x = j * cellSize;
          const y = i * cellSize;
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  }, [grid, cellSize]);

  // Draw grid whenever grid changes
  useEffect(() => {
    drawGrid();
  }, [drawGrid, grid]);

  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      isDrawingRef.current = true;
      drawModeRef.current = !grid[y][x];
      onCellToggle(x, y, drawModeRef.current);
      lastCellRef.current = { x, y };
    }
  }, [cellSize, grid, onCellToggle]);
  
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (lastCellRef.current && (lastCellRef.current.x !== x || lastCellRef.current.y !== y)) {
      onCellToggle(x, y, drawModeRef.current);
      lastCellRef.current = { x, y };
    }
  }, [cellSize, onCellToggle]);
  
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

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseLeave}
      className="bg-background/30 rounded-lg shadow-inner cursor-pointer"
    />
  );
};

export default GameGrid;
