import { expect, test, describe, mock } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Cell from "./Cell";

describe("Cell component", () => {
  describe("rendering", () => {
    test("renders a div element", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      expect(container.firstChild).not.toBeNull();
      expect((container.firstChild as HTMLElement).tagName).toBe("DIV");
    });

    test("applies bg-primary class when cell is alive", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={true} x={0} y={0} size={12} onClick={onClick} />
      );
      expect((container.firstChild as HTMLElement).className).toContain("bg-primary");
    });

    test("does not apply bg-primary class when cell is dead", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      expect((container.firstChild as HTMLElement).className).not.toContain("bg-primary");
    });

    test("applies dead cell classes when cell is not alive", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain("bg-background/30");
      expect(el.className).toContain("border");
      expect(el.className).toContain("border-primary/5");
    });

    test("changes class when isAlive transitions from false to true", () => {
      const onClick = mock(() => {});
      const { container, rerender } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      expect((container.firstChild as HTMLElement).className).not.toContain("bg-primary");
      rerender(<Cell isAlive={true} x={0} y={0} size={12} onClick={onClick} />);
      expect((container.firstChild as HTMLElement).className).toContain("bg-primary");
    });
  });

  describe("inline styles", () => {
    test("sets width to size - 1", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.width).toBe("11px");
    });

    test("sets height to size - 1", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.height).toBe("11px");
    });

    test("sets position to absolute", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.position).toBe("absolute");
    });

    test("computes left as x * size", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={3} y={0} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.left).toBe("36px");
    });

    test("computes top as y * size", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={5} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.top).toBe("60px");
    });

    test("handles x=0, y=0 positioning (top-left corner)", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={0} y={0} size={10} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.left).toBe("0px");
      expect(el.style.top).toBe("0px");
    });

    test("reflects different size values correctly", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={2} y={3} size={20} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.width).toBe("19px");
      expect(el.style.height).toBe("19px");
      expect(el.style.left).toBe("40px");
      expect(el.style.top).toBe("60px");
    });
  });

  describe("click behavior", () => {
    test("calls onClick with the correct x and y coordinates when clicked", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={3} y={7} size={12} onClick={onClick} />
      );
      fireEvent.click(container.firstChild as HTMLElement);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(3, 7);
    });

    test("calls onClick with x=0, y=0 for origin cell", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={true} x={0} y={0} size={12} onClick={onClick} />
      );
      fireEvent.click(container.firstChild as HTMLElement);
      expect(onClick).toHaveBeenCalledWith(0, 0);
    });

    test("does not call onClick when no click event occurs", () => {
      const onClick = mock(() => {});
      render(<Cell isAlive={false} x={1} y={1} size={12} onClick={onClick} />);
      expect(onClick).toHaveBeenCalledTimes(0);
    });

    test("calls onClick each time the cell is clicked (multiple clicks)", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={false} x={2} y={4} size={12} onClick={onClick} />
      );
      const el = container.firstChild as HTMLElement;
      fireEvent.click(el);
      fireEvent.click(el);
      fireEvent.click(el);
      expect(onClick).toHaveBeenCalledTimes(3);
      expect(onClick).toHaveBeenNthCalledWith(1, 2, 4);
      expect(onClick).toHaveBeenNthCalledWith(3, 2, 4);
    });

    test("alive cell also triggers onClick with correct coordinates", () => {
      const onClick = mock(() => {});
      const { container } = render(
        <Cell isAlive={true} x={9} y={5} size={14} onClick={onClick} />
      );
      fireEvent.click(container.firstChild as HTMLElement);
      expect(onClick).toHaveBeenCalledWith(9, 5);
    });
  });
});