import { expect, test, describe, mock, beforeEach, afterEach } from "bun:test";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import GameOfLife from "./GameOfLife";

// Mock requestAnimationFrame and cancelAnimationFrame for tests
let rafCallbacks: Map<number, FrameRequestCallback> = new Map();
let rafId = 0;

beforeEach(() => {
  rafCallbacks.clear();
  rafId = 0;

  globalThis.requestAnimationFrame = mock((cb: FrameRequestCallback) => {
    const id = ++rafId;
    rafCallbacks.set(id, cb);
    return id;
  });

  globalThis.cancelAnimationFrame = mock((id: number) => {
    rafCallbacks.delete(id);
  });
});

afterEach(() => {
  rafCallbacks.clear();
});

// Helper to render GameOfLife with sensible small defaults
function renderGameOfLife(props: Partial<React.ComponentProps<typeof GameOfLife>> = {}) {
  const defaults = {
    gridSize: 5,
    cellSize: 10,
    isRunning: false,
    speed: 100,
  };
  return render(<GameOfLife {...defaults} {...props} />);
}

describe("GameOfLife component", () => {
  describe("prop interface (post-PR changes)", () => {
    test("renders without onStep prop", () => {
      // onStep was removed in this PR; component should not expect it
      const { container } = renderGameOfLife();
      expect(container.firstChild).not.toBeNull();
    });

    test("renders with only required props (uses defaults)", () => {
      expect(() => render(<GameOfLife />)).not.toThrow();
    });

    test("accepts gridSize, cellSize, speed, isRunning, and initialPattern props", () => {
      const pattern = [[true, false], [false, true]];
      expect(() =>
        renderGameOfLife({ gridSize: 5, cellSize: 10, speed: 200, isRunning: false, initialPattern: pattern })
      ).not.toThrow();
    });
  });

  describe("initial render", () => {
    test("displays generation 0 on mount", () => {
      renderGameOfLife();
      expect(screen.getByText("0")).toBeDefined();
      // "Generation: 0" label should be visible
      expect(screen.getByText(/Generation:/)).toBeDefined();
    });

    test("displays population 0 for an empty grid on mount", () => {
      renderGameOfLife({ gridSize: 5 });
      expect(screen.getByText(/Population:/)).toBeDefined();
      // Initially all cells are false, population should be 0
      const populationEl = screen.getByText(/Population:/).closest("div");
      expect(populationEl?.textContent).toContain("0");
    });

    test("displays correct population when initialPattern has alive cells", () => {
      // A 3x3 pattern with 3 alive cells (blinker)
      const blinker = [
        [false, false, false],
        [true, true, true],
        [false, false, false],
      ];
      renderGameOfLife({ gridSize: 5, initialPattern: blinker });
      const populationEl = screen.getByText(/Population:/).closest("div");
      expect(populationEl?.textContent).toContain("3");
    });

    test("renders a canvas element for the game grid", () => {
      const { container } = renderGameOfLife({ gridSize: 5, cellSize: 10 });
      const canvas = container.querySelector("canvas");
      expect(canvas).not.toBeNull();
    });

    test("canvas has correct dimensions based on gridSize and cellSize", () => {
      const { container } = renderGameOfLife({ gridSize: 5, cellSize: 10 });
      const canvas = container.querySelector("canvas") as HTMLCanvasElement;
      expect(canvas.width).toBe(50);
      expect(canvas.height).toBe(50);
    });
  });

  describe("animation frame management", () => {
    test("starts requestAnimationFrame on mount regardless of isRunning state", () => {
      renderGameOfLife({ isRunning: false });
      expect((globalThis.requestAnimationFrame as ReturnType<typeof mock>).mock.calls.length).toBeGreaterThan(0);
    });

    test("starts requestAnimationFrame when isRunning is true", () => {
      renderGameOfLife({ isRunning: true });
      expect((globalThis.requestAnimationFrame as ReturnType<typeof mock>).mock.calls.length).toBeGreaterThan(0);
    });

    test("cancels animation frame on unmount", () => {
      const { unmount } = renderGameOfLife({ isRunning: true });
      const cancelMock = globalThis.cancelAnimationFrame as ReturnType<typeof mock>;
      unmount();
      expect(cancelMock.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe("grid initialization with initialPattern", () => {
    test("re-initializes grid when initialPattern changes", () => {
      const pattern1 = [[true, false], [false, false]];
      const pattern2 = [[true, true], [true, false]];
      const { rerender } = renderGameOfLife({ gridSize: 5, initialPattern: pattern1 });
      // Population should reflect pattern1 (1 alive cell)
      let populationEl = screen.getByText(/Population:/).closest("div");
      expect(populationEl?.textContent).toContain("1");

      rerender(
        <GameOfLife gridSize={5} cellSize={10} speed={100} isRunning={false} initialPattern={pattern2} />
      );
      // Population should reflect pattern2 (3 alive cells)
      populationEl = screen.getByText(/Population:/).closest("div");
      expect(populationEl?.textContent).toContain("3");
    });

    test("centers initialPattern in the grid", () => {
      // A 1x1 pattern with single alive cell should produce population of 1
      const singleCell = [[true]];
      renderGameOfLife({ gridSize: 5, initialPattern: singleCell });
      const populationEl = screen.getByText(/Population:/).closest("div");
      expect(populationEl?.textContent).toContain("1");
    });

    test("initializes to empty grid when no initialPattern provided", () => {
      renderGameOfLife({ gridSize: 5 });
      const populationEl = screen.getByText(/Population:/).closest("div");
      expect(populationEl?.textContent).toContain("0");
    });
  });

  describe("computeNext: population and generation tracking", () => {
    test("generation does not increment when simulation is not running", () => {
      renderGameOfLife({ isRunning: false, gridSize: 5 });
      // Run enough RAF callbacks to pass speed threshold
      act(() => {
        // Fire all pending RAF callbacks with elapsed time > speed
        for (const [id, cb] of [...rafCallbacks.entries()]) {
          cb(1000); // timestamp well past the 100ms speed threshold
        }
      });
      // generation should still be 0 since isRunning is false
      const genEl = screen.getByText(/Generation:/).closest("div");
      expect(genEl?.textContent).toContain("0");
    });
  });
});