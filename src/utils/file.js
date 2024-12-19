const fs = require("fs");
const { logError } = require("./log");

/**
 * 异步读文件
 * @param {*} filePath 读取文件的路径
 */
function readLocalFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(filePath, "utf8", (error, data) => {
        if (error) {
          logError(error);
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      logError(error);
      reject(error);
    }
  });
}

/**
 * 同步读文件
 * @param {*} filePath 读取文件的路径
 */
function readLocalFileSync(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    logError("File does not exist!");
    return null;
  }
}

/**
 * 异步写入文件
 * @param {*} file
 */
function writeLocalFile(file, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, file, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

module.exports = { readLocalFile, readLocalFileSync, writeLocalFile };
