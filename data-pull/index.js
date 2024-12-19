const colors = require("colors-console");

const pullOnePageData = require("./pull");
const setFilePath = require("../file/set-path");
const writeLocalFile = require("../file/write-file");
const readJSONDataSource = require("../utils/readJSONDataSource");

function writeDataJson(data) {
  return writeLocalFile(
    JSON.stringify(data),
    setFilePath("../file/", "data.json")
  );
}

function filterResponseData(list) {
  try {
    return list.map(({ prizeLevelList /* remove */, ...rest }) => rest);
  } catch (error) {
    return list;
  }
}

/**
 * 拉取全部数据
 */
async function pullAllData() {
  // 清空文件中的数据
  writeDataJson([]);

  function appendDataInFile(data) {
    return new Promise(async (resolve) => {
      if (Array.isArray(data) && data.length > 0) {
        // 读取文件
        const local = readJSONDataSource();

        // insert
        local.push(...data);

        // 写入文件
        await writeDataJson(local);

        resolve(true);
      }
    });
  }

  async function pullData(page) {
    return new Promise((resolve, reject) => {
      pullOnePageData(page)
        .then(async (data /* object type */) => {
          try {
            const { pages, pageNo, list } = data;

            // handle data then append.
            appendDataInFile(filterResponseData(list));

            // pull completed.
            if (pages === pageNo) resolve("ending");
            // pull next page data.
            else {
              const timeout = Math.ceil((Math.random() + 0.5) * 30 * 1000);
              // waiting
              setTimeout(() => pullData(pageNo + 1), timeout);
            }
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => {
          console.log(colors("red", "Pull All-Data Error!"));
          console.log(colors("red", error));
          reject(error);
        });
    });
  }
  pullData(1);
}

/**
 * 拉取最新数据
 */
function pullLatestData() {
  pullOnePageData(1)
    .then((data) => {
      try {
        const local = readJSONDataSource();
        const list = filterResponseData(data.list);
        // 更新多个新数据
        const latest = [];
        for (let i = 0; i < list.length; i++) {
          const curr = list[i];
          if (
            !local.some((item) => item.lotteryDrawTime === curr.lotteryDrawTime)
          ) {
            latest.push(curr);
          } else break;
        }

        const LatestLength = latest.length;
        console.log(colors("blue", `${LatestLength} data has been updated.`));

        if (LatestLength > 0) {
          // write data
          local.unshift(...latest);
          writeDataJson(local);

          // todo 返回数据，不处理缓存问题
          // update cache
          writeLocalFile(
            JSON.stringify(local),
            setFilePath("../cache/", "data.json")
          );
          console.log(colors("blue", `Cache data has been updated.`));
        }
      } catch (error) {
        console.log(colors("red", "Pull Latest-Data Error!"));
        console.log(colors("red", error));
      }
    })
    .catch((error) => {
      console.log(colors("red", "Pull Latest-Data Error!"));
      console.log(colors("red", error));
    });
}

module.exports = {
  pullAllData,
  pullLatestData,
};
