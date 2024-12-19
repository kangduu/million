const { readLocalFileSync } = require("../file/read-file");
const setFilePath = require("../file/set-path");

function readJSONDataSource() {
  let local = readLocalFileSync(setFilePath("../file/", "data.json"));
  if (local) local = JSON.parse(local);
  else local = [];

  return local;
}

module.exports = readJSONDataSource;
