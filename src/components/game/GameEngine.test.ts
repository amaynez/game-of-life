import { describe, it, expect } from 'bun:test';
import { createEmptyGrid, createRandomGrid } from './GameEngine';

describe('GameEngine', () => {
  describe('createEmptyGrid', () => {
    it('creates a grid of the correct size', () => {
      const size = 10;
      const grid = createEmptyGrid(size);
      expect(grid.length).toBe(size);
      grid.forEach(row => {
        expect(row.length).toBe(size);
      });
    });

    it('initializes all cells to false', () => {
      const size = 5;
      const grid = createEmptyGrid(size);
      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe(false);
        });
      });
    });
  });

  describe('createRandomGrid', () => {
    it('creates a grid of the correct size', () => {
      const size = 10;
      const grid = createRandomGrid(size, 0.5);
      expect(grid.length).toBe(size);
      grid.forEach(row => {
        expect(row.length).toBe(size);
      });
    });

    it('creates cells with boolean values', () => {
      const size = 5;
      const grid = createRandomGrid(size, 0.5);
      grid.forEach(row => {
        row.forEach(cell => {
          expect(typeof cell).toBe('boolean');
        });
      });
    });
  });
});
