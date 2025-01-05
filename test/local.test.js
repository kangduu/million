const readLocalData = require("../src/utils/local.js");

async function t() {
  const data = await readLocalData("/src/lib/p3.json");
  return data.length > 0; // 修改返回值为布尔值
}

test("read local data", async () => {
  await expect(t()).resolves.toBe(true);
});
