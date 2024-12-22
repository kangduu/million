const { readLocalFile } = require("../src/utils/file");
const getPathCWD = require("../src/utils/path");

readLocalFile(getPathCWD("/test/local.test.js"))
  .then((data) => {})
  .catch((error) => {});
