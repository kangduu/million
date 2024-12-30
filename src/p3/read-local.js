const { readLocalFileSync } = require("../utils/file");
const getPathCWD = require("../utils/path");

function readLocalP3Data() {
  try {
    const path = getPathCWD("/src/lib/p3.json");
    let data = readLocalFileSync(path);
    if (data) data = JSON.parse(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = readLocalP3Data;
