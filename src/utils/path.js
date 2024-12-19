const path = require("path");
const fs = require("fs");

/**
 * 设置文件保存的路径
 * @param {*} url 目标文件夹路径
 * @param {*} filename 文件名称
 * @returns
 */
function setFilePath(url, filename) {
  // 目标子目录路径
  const dirPath = path.join(__dirname, url);

  // 检查子目录是否存在，如果不存在则创建
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 设置目标文件路径
  return path.join(dirPath, filename);
}

module.exports = setFilePath;
