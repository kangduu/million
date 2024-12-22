const { readLocalFile } = require("./file");
const getPathCWD = require("./path");

async function readLocalData(url) {
  let local = await readLocalFile(getPathCWD(url)).then((data) => data);
  if (local) local = JSON.parse(local);
  else local = null;

  return local;
}

module.exports = readLocalData;
