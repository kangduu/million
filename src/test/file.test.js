const { readLocalFile } = require("../utils/file");
const getPathCWD = require("../utils/path");

readLocalFile(getPathCWD("./", "index.js"))
  .then((data) => {})
  .catch((error) => {});
