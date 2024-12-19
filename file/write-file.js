const fs = require("fs");
const colors = require("colors-console");

/**
 * 异步写入文件
 * @param {*} file
 */
function writeLocalFile(file, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, file, (err) => {
      if (err) {
        console.log(colors("grey", filePath));
        console.log(colors("red", "File write failure!", err));
        reject(err);
      } else {
        console.log(colors("green", "File write success!"));
        resolve(true);
      }
    });
  });
}

module.exports = writeLocalFile;
