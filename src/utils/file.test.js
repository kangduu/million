const { readLocalFile } = require("./file");
const { logSuccess, logError } = require("./log");
const setFilePath = require("./path");

readLocalFile(setFilePath("./", "log.t1st.js"))
  .then((data) => {
    logSuccess(data);
  })
  .catch((error) => {});
