const {
  getP3LatestData,
  getP5LatestData,
  getLotteryLatestData,
} = require("./pull");
const logger = require("./utils/logger");

async function latest() {
  logger.warn("--- Update Permutation 3 Data ---");
  await getP3LatestData();

  logger.warn("--- Update Permutation 5 Data ---");
  await getP5LatestData();

  logger.warn("--- Update Lottery Data ---");
  await getLotteryLatestData();
}

latest();
