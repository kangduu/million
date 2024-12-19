const colors = require("colors-console");

function log(color: string, msg: string) {
  console.log(colors(color, msg));
}

module.exports = {
  logInfo: function (msg: string) {
    log("grey", msg);
  },
  logWarning: function (msg: string) {
    log("magenta", msg);
  },
};
