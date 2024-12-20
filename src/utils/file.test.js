const { readLocalFile } = require("./file");
const logger = require("./logger");
const setFilePath = require("./path");

readLocalFile(setFilePath("./", "log.t1st.js"))
  .then((data) => {
    logger.info(data);
  })
  .catch((error) => {});
