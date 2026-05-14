import { expect, it, describe } from "bun:test";
import { cn } from "./utils";

describe("cn utility", () => {
  it("concatenates class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  it("handles undefined, null, and boolean values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles arrays and nested arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn(["foo", ["bar", "baz"]])).toBe("foo bar baz");
  });

  it("handles complex combinations of all inputs", () => {
    expect(
      cn(
        "base-class",
        [
          "array-1",
          { "nested-obj": true },
          ["deeply-nested"]
        ],
        { "conditional-true": true, "conditional-false": false },
        "px-2",
        "px-4",
        null,
        undefined,
        "text-red-500",
        "text-blue-500"
      )
    ).toBe("base-class array-1 nested-obj deeply-nested conditional-true px-4 text-blue-500");
  });
});
