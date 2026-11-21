import { describe, expect, it } from "vitest";
import { fittedSize } from "@/lib/compress-image";

describe("fittedSize", () => {
  it("shrinks the long edge of a large sonar image to 1600", () => {
    expect(fittedSize(4000, 3000)).toEqual({ width: 1600, height: 1200 });
  });

  it("leaves a picture that is already small enough", () => {
    expect(fittedSize(800, 600)).toEqual({ width: 800, height: 600 });
  });

  it("shrinks a tall image from its height", () => {
    expect(fittedSize(100, 2000)).toEqual({ width: 80, height: 1600 });
  });
});
