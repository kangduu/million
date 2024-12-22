const readLocalData = require("../src/utils/local.js");

async function t() {
  const data = await readLocalData("/src/lib/p3.json");
  console.log(data.length);
  console.log(data[0]);
}

t();
