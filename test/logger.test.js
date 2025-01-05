const logger = require("../src/utils/logger");

function t() {
  logger.warn("Hello, Nodejs");

  logger.error("Error");

  logger.info("Information");

  return "logger";
}

test("logger test", () => {
  expect(t()).toBe("logger");
});
