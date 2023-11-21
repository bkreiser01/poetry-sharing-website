import * as helpers from "../helpers.js";

describe("formatString", () => {
  test("no_args", () => {
    expect(() => {
      helpers.formatString();
    }).toThrow();
  });
});
