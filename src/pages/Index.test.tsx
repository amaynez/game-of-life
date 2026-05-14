import { expect, test, describe, mock, beforeEach, afterEach } from "bun:test";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import React from "react";

// Mock sonner toast to prevent side effects
mock.module("sonner", () => ({
  toast: mock(() => {}),
  Toaster: () => null,
}));

// Mock requestAnimationFrame to prevent infinite animation loops
beforeEach(() => {
  globalThis.requestAnimationFrame = mock((cb: FrameRequestCallback) => {
    // Don't automatically call the callback to prevent runaway loops
    return 1;
  });
  globalThis.cancelAnimationFrame = mock(() => {});
});

afterEach(() => {
  // Clean up any lingering mocks
});

// Dynamic import after mocks to ensure mocks take effect
import Index from "./Index";

describe("Index page", () => {
  describe("step functionality removed (PR change)", () => {
    test("renders without any step-related props being passed to Controls", () => {
      const { container } = render(<Index />);
      // Step button should still exist (it renders in Controls), but clicking it does nothing
      expect(screen.getByText("Step")).toBeDefined();
    });

    test("clicking Step button does not throw or cause errors", () => {
      render(<Index />);
      expect(() => {
        fireEvent.click(screen.getByText("Step"));
      }).not.toThrow();
    });

    test("clicking Step button multiple times does not cause errors", () => {
      render(<Index />);
      const stepButton = screen.getByText("Step");
      expect(() => {
        fireEvent.click(stepButton);
        fireEvent.click(stepButton);
        fireEvent.click(stepButton);
      }).not.toThrow();
    });
  });

  describe("handleClear behavior (PR change)", () => {
    test("clicking Clear stops the simulation (isRunning becomes false)", async () => {
      render(<Index />);
      // Start the simulation
      fireEvent.click(screen.getByText("Play"));
      expect(screen.getByText("Pause")).toBeDefined();

      // Click Clear
      act(() => {
        fireEvent.click(screen.getByText("Clear"));
      });

      // Simulation should be stopped
      await waitFor(() => {
        expect(screen.getByText("Play")).toBeDefined();
      });
    });

    test("Clear button is present and clickable", () => {
      render(<Index />);
      const clearButton = screen.getByText("Clear");
      expect(clearButton).toBeDefined();
      expect(() => fireEvent.click(clearButton)).not.toThrow();
    });
  });

  describe("play/pause toggle", () => {
    test("starts in paused state (shows Play button)", () => {
      render(<Index />);
      expect(screen.getByText("Play")).toBeDefined();
    });

    test("toggles to running state when Play is clicked", () => {
      render(<Index />);
      fireEvent.click(screen.getByText("Play"));
      expect(screen.getByText("Pause")).toBeDefined();
    });

    test("toggles back to paused state when Pause is clicked", () => {
      render(<Index />);
      fireEvent.click(screen.getByText("Play"));
      fireEvent.click(screen.getByText("Pause"));
      expect(screen.getByText("Play")).toBeDefined();
    });
  });

  describe("pattern selection", () => {
    test("renders all four predefined pattern buttons", () => {
      render(<Index />);
      expect(screen.getByText("Glider")).toBeDefined();
      expect(screen.getByText("Blinker")).toBeDefined();
      expect(screen.getByText("Pulsar")).toBeDefined();
      expect(screen.getByText("Gosper Glider Gun")).toBeDefined();
    });

    test("clicking a pattern button does not throw", () => {
      render(<Index />);
      expect(() => {
        fireEvent.click(screen.getByText("Glider"));
      }).not.toThrow();
    });

    test("clicking a pattern button stops the simulation", async () => {
      render(<Index />);
      // Start simulation
      fireEvent.click(screen.getByText("Play"));
      expect(screen.getByText("Pause")).toBeDefined();
      // Select pattern
      act(() => {
        fireEvent.click(screen.getByText("Blinker"));
      });
      // Simulation should stop
      await waitFor(() => {
        expect(screen.getByText("Play")).toBeDefined();
      });
    });
  });

  describe("Random button", () => {
    test("clicking Random does not throw", () => {
      render(<Index />);
      expect(() => {
        fireEvent.click(screen.getByText("Random"));
      }).not.toThrow();
    });
  });

  describe("general rendering", () => {
    test("renders Controls component", () => {
      render(<Index />);
      expect(screen.getByText("Controls")).toBeDefined();
    });

    test("renders speed slider", () => {
      render(<Index />);
      expect(screen.getByRole("slider")).toBeDefined();
    });

    test("renders without crashing", () => {
      expect(() => render(<Index />)).not.toThrow();
    });
  });
});
