const { readLocalFile } = require("../utils/file");
const setFilePath = require("../utils/path");

readLocalFile(setFilePath("./", "index.js"))
  .then((data) => {})
  .catch((error) => {});
