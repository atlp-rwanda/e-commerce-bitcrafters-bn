import { expect } from "chai";
import { sum, sub, multiply, div } from "../src/math";

describe("Testing Index", () => {
  it("should return 10 when have 8 + 2", () => {
    expect(sum(8, 2)).to.equal(10);
  });
  it("Should return the 6  when we have 8 - 2", () => {
    expect(sub(8, 2)).to.equal(6);
  });
  it("should return 16 when we have 8 * 2", () => {
    expect(multiply(8, 2)).to.equal(16);
  });
  it("Should return 4 when we have 8 / 2", () => {
    expect(div(8, 2)).to.equal(4);
  });
});
