const { readLocalFile } = require("./src/utils/file");
const setFilePath = require("./src/utils/path");

function replace() {
  const p3 = readLocalFile(setFilePath("/src/lib", "p3.json"));
}

replace();
