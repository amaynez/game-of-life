
export const computeNextGeneration = (grid: boolean[][], gridSize: number): { newGrid: boolean[][], aliveCount: number } => {
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
          
          if (grid[newI][newJ]) {
            neighbors++;
          }
        }
      }
      
      if (grid[i][j]) {
        newGrid[i][j] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[i][j] = neighbors === 3;
      }
      
      if (newGrid[i][j]) {
        aliveCount++;
      }
    }
  }
  
  return { newGrid, aliveCount };
};

export const countAlive = (grid: boolean[][]): number => {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j]) count++;
    }
  }
  return count;
};
