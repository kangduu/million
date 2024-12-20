const https = require("https");

async function pullOnePageData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, function (res) {
        let words = "";
        res.on("data", function (data) {
          words += data;
        });
        res.on("end", function () {
          const data = JSON.parse(words).value;
          resolve(data);
        });
      })
      .on("error", function (error) {
        reject(null);
      });
  });
}

function checkPageType(page) {
  if (typeof page !== "number")
    throw Error("Expect page to be of type number.");
}

function requestUrl(game, page) {
  checkPageType(page);
  return `https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=${game}&provinceId=0&pageSize=100&isVerify=1&pageNo=${page}`;
}

async function fetchP5(page) {
  checkPageType(page);
  return await pullOnePageData(requestUrl("350133", page));
}

async function fetchP3(page) {
  checkPageType(page);
  return await pullOnePageData(requestUrl("35", page));
}

async function fetchLottery(page) {
  checkPageType(page);
  return await pullOnePageData(requestUrl("85", page));
}

module.exports = {
  fetchP5,
  fetchP3,
  fetchLottery,
};
