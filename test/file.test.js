const { readLocalFile } = require("../src/utils/file");
const getPathCWD = require("../src/utils/path");

async function t() {
  const path = await readLocalFile(getPathCWD("/test/local.test.js"));
  console.log(path);
  return "path"; // 修改返回值为 "path"
}

test("get path cwd", async () => {
  await expect(t()).resolves.toBe("path");
});
