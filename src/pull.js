const https = require("https");
const colors = require("colors-console");

// const url = `https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=35&provinceId=0&pageSize=100&isVerify=1&pageNo=${page}`;
// 拉取某一页的数据
async function pullOnePageData(page: number, url: string) {
  return new Promise((resolve, reject) => {
    https
      .get(url, function (res) {
        let html = "";
        res.on("data", function (data) {
          html += data;
        });
        res.on("end", function () {
          const data = JSON.parse(html).value;
          console.log(colors("yellow", `Current Page：${data.pageNo}`));
          resolve(data);
        });
      })
      .on("error", function () {
        console.log(colors("red", "获取数据错误！"));
        reject(null);
      });
  });
}

module.exports = pullOnePageData;
