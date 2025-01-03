import fs from "fs";
import logger from "./logger.ts";

/**
 * 异步读文件
 * @param {*} filePath 读取文件的路径
 * @returns 文件内容
 */
export function readLocalFile(filePath: string) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(filePath, "utf8", (error, data) => {
        if (error) {
          logger.error(error);
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

/**
 * 同步读文件
 * @param {*} filePath 读取文件的路径
 * @returns 文件内容
 */
export function readLocalFileSync(filePath: string) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    logger.error("File does not exist!");
    return null;
  }
}

/**
 * 异步写入文件
 * @param {*} file 写入的内容
 * @param {*} filePath 写入的文件路径
 * @returns 写入结果
 */
export function writeLocalFile(file: string, filePath: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, file, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}
