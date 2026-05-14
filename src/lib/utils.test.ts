import { expect, test, describe } from "bun:test";
import { cn } from "./utils";

describe("cn utility", () => {
  test("concatenates class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("merges tailwind classes correctly", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  test("handles conditional classes", () => {
    expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  test("handles undefined, null, and boolean values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  test("complex combinations", () => {
    expect(
      cn(
        "base-class",
        { "conditional-true": true, "conditional-false": false },
        "px-2",
        "px-4",
        null,
        undefined,
        "text-red-500",
        "text-blue-500"
      )
    ).toBe("base-class conditional-true px-4 text-blue-500");
  });
});
