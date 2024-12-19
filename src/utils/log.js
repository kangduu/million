const colors = require("colors-console");

function log(color, msg) {
  console.log(colors(color, msg));
}

function logInfo(msg) {
  log(["grey", "italic"], msg);
}

function logWarning(msg) {
  log(["yellow", "italic"], msg);
}

function logSuccess(msg) {
  log(["magenta", "italic"], msg);
}

function logError(msg) {
  log(["red", "italic"], msg);
}

module.exports = {
  logInfo,
  logWarning,
  logSuccess,
  logError,
};
