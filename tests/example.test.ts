import assert from "power-assert";

function add(a: number, b: number): number {
  return a + b;
}

describe("add function", () => {
  it("1 + 1 = 2", () => {
    assert(add(1, 1) === 2)
  });
});