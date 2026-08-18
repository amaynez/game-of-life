
export const createEmptyGrid = (gridSize: number): boolean[][] => {
  const grid = new Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    const row = new Array(gridSize);
    for (let j = 0; j < gridSize; j++) {
      row[j] = false;
    }
    grid[i] = row;
  }
  return grid;
};

export const createRandomGrid = (gridSize: number, probability: number = 0.85): boolean[][] => {
  const grid = new Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    const row = new Array(gridSize);
    for (let j = 0; j < gridSize; j++) {
      row[j] = Math.random() > probability;
    }
    grid[i] = row;
  }
  return grid;
};

export const computeNextGeneration = (grid: boolean[][], gridSize: number): { newGrid: boolean[][], aliveCount: number } => {
  const newGrid = createEmptyGrid(gridSize);
  let aliveCount = 0;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let neighbors = 0;
      
      for (let x = -1; x <= 1; x++) {
        let newI = i + x;
        if (newI < 0) newI = gridSize - 1;
        else if (newI >= gridSize) newI = 0;

        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue;
          
          let newJ = j + y;
          if (newJ < 0) newJ = gridSize - 1;
          else if (newJ >= gridSize) newJ = 0;
          
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
