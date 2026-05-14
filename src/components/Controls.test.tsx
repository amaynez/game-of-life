import { expect, test, describe, mock } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Controls from "./Controls";

// Helper to render Controls with required props, allowing overrides
function renderControls(overrides: Partial<React.ComponentProps<typeof Controls>> = {}) {
  const defaults = {
    isRunning: false,
    onToggleRunning: mock(() => {}),
    onClear: mock(() => {}),
    onRandom: mock(() => {}),
    onSpeedChange: mock(() => {}),
    speed: 100,
  };
  const props = { ...defaults, ...overrides };
  return { ...render(<Controls {...props} />), props };
}

describe("Controls component", () => {
  describe("prop interface (post-PR changes)", () => {
    test("renders without onStep prop", () => {
      // onStep was removed in this PR; passing it should not be required (and not accepted)
      const { container } = renderControls();
      expect(container.firstChild).not.toBeNull();
    });

    test("accepts all required props without TypeScript errors at runtime", () => {
      expect(() => renderControls()).not.toThrow();
    });
  });

  describe("Play/Pause button", () => {
    test("shows Play text when not running", () => {
      renderControls({ isRunning: false });
      expect(screen.getByText("Play")).toBeDefined();
    });

    test("shows Pause text when running", () => {
      renderControls({ isRunning: true });
      expect(screen.getByText("Pause")).toBeDefined();
    });

    test("calls onToggleRunning when Play button is clicked", () => {
      const onToggleRunning = mock(() => {});
      renderControls({ isRunning: false, onToggleRunning });
      fireEvent.click(screen.getByText("Play"));
      expect(onToggleRunning).toHaveBeenCalledTimes(1);
    });

    test("calls onToggleRunning when Pause button is clicked", () => {
      const onToggleRunning = mock(() => {});
      renderControls({ isRunning: true, onToggleRunning });
      fireEvent.click(screen.getByText("Pause"));
      expect(onToggleRunning).toHaveBeenCalledTimes(1);
    });
  });

  describe("Clear button", () => {
    test("renders Clear button", () => {
      renderControls();
      expect(screen.getByText("Clear")).toBeDefined();
    });

    test("calls onClear when Clear button is clicked", () => {
      const onClear = mock(() => {});
      renderControls({ onClear });
      fireEvent.click(screen.getByText("Clear"));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    test("does not call other handlers when Clear is clicked", () => {
      const onToggleRunning = mock(() => {});
      const onRandom = mock(() => {});
      const onClear = mock(() => {});
      renderControls({ onToggleRunning, onRandom, onClear });
      fireEvent.click(screen.getByText("Clear"));
      expect(onToggleRunning).toHaveBeenCalledTimes(0);
      expect(onRandom).toHaveBeenCalledTimes(0);
    });
  });

  describe("Random button", () => {
    test("renders Random button", () => {
      renderControls();
      expect(screen.getByText("Random")).toBeDefined();
    });

    test("calls onRandom when Random button is clicked", () => {
      const onRandom = mock(() => {});
      renderControls({ onRandom });
      fireEvent.click(screen.getByText("Random"));
      expect(onRandom).toHaveBeenCalledTimes(1);
    });
  });

  describe("Step button (no-op after PR change)", () => {
    test("renders Step button", () => {
      renderControls();
      expect(screen.getByText("Step")).toBeDefined();
    });

    test("clicking Step button does not call any external handler", () => {
      const onToggleRunning = mock(() => {});
      const onClear = mock(() => {});
      const onRandom = mock(() => {});
      const onSpeedChange = mock(() => {});
      renderControls({ onToggleRunning, onClear, onRandom, onSpeedChange });
      fireEvent.click(screen.getByText("Step"));
      expect(onToggleRunning).toHaveBeenCalledTimes(0);
      expect(onClear).toHaveBeenCalledTimes(0);
      expect(onRandom).toHaveBeenCalledTimes(0);
      expect(onSpeedChange).toHaveBeenCalledTimes(0);
    });

    test("clicking Step button multiple times does not throw", () => {
      renderControls();
      const stepButton = screen.getByText("Step");
      expect(() => {
        fireEvent.click(stepButton);
        fireEvent.click(stepButton);
        fireEvent.click(stepButton);
      }).not.toThrow();
    });
  });

  describe("Speed slider", () => {
    test("renders speed slider with correct value", () => {
      renderControls({ speed: 250 });
      const slider = screen.getByRole("slider") as HTMLInputElement;
      expect(slider.value).toBe("250");
    });

    test("displays speed value in milliseconds", () => {
      renderControls({ speed: 150 });
      expect(screen.getByText("150ms")).toBeDefined();
    });

    test("calls onSpeedChange with numeric value when slider changes", () => {
      const onSpeedChange = mock(() => {});
      renderControls({ onSpeedChange });
      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "200" } });
      expect(onSpeedChange).toHaveBeenCalledTimes(1);
      expect(onSpeedChange).toHaveBeenCalledWith(200);
    });

    test("slider has min=10, max=500, step=10 attributes", () => {
      renderControls({ speed: 100 });
      const slider = screen.getByRole("slider") as HTMLInputElement;
      expect(slider.min).toBe("10");
      expect(slider.max).toBe("500");
      expect(slider.step).toBe("10");
    });

    test("displays Fast and Slow labels", () => {
      renderControls();
      expect(screen.getByText("Fast")).toBeDefined();
      expect(screen.getByText("Slow")).toBeDefined();
    });
  });

  describe("general rendering", () => {
    test("renders Controls heading", () => {
      renderControls();
      expect(screen.getByText("Controls")).toBeDefined();
    });

    test("renders all four action buttons", () => {
      renderControls({ isRunning: false });
      expect(screen.getByText("Play")).toBeDefined();
      expect(screen.getByText("Clear")).toBeDefined();
      expect(screen.getByText("Random")).toBeDefined();
      expect(screen.getByText("Step")).toBeDefined();
    });
  });
});