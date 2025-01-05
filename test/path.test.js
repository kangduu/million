const getPathCWD = require("../src/utils/path");

// const path = getPathCWD("../src/lib/p3.json");

test("should first", () => {
  expect(getPathCWD("../src/lib/p3.json")).toBe(
    "E:\\src\\lib\\p3.json"
  );
});
