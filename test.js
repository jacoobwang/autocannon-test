const autocannon = require("autocannon");
const reporter = require("autocannon-reporter");
const path = require("path");

// 请求参数
const autocannonParam = {
  url: "http://localhost:5000/api/",
  connections: 1,
  duration: 10,
  headers: {
    "Content-type": "application/x-www-form-urlencoded",
  },
};

// 请求报文参数
const requestsParam = {
  method: "POST",

  // headers
  headers: {
    "Content-type": "application/json; charset=utf-8",
    "ling-req-key": "tester",
    "ling-req-token": "15329443937933ki4b2d1t2g",
  },

  body:
    '{"batch":[{"template_id":"5e7d9adf5bef6e14faaba8e1","texts":["华为标题标题标题dsadada","8GB+256GB亮黑色全网通5G手机"],"sku_id":"69537314471","images":["jfs/t1/30088/25/2592/2609/5c6d3eb2Eee5d1764/91ff9d73735f42fa.png"],"format":"png"}]}',
};

async function run(methodList) {
  const autocannonList = methodList.map((val) => {
    return {
      ...autocannonParam,
      url: autocannonParam.url + val,
      title: val,
      requests: [
        {
          ...requestsParam,
        },
      ],
    };
  });
  console.log("autocannonList", autocannonList);
  for (let i = 0; i < autocannonList.length; i++) {
    if (i !== 0) {
      await sleep((autocannonList[i - 1].duration + 2) * 1000);
      makeAutocannon(autocannonList[i]);
    } else {
      makeAutocannon(autocannonList[i]);
    }
  }
}

/**
 * @description
 * 运行autocannon
 * @author lizc
 * @param {*} param
 */
function makeAutocannon(param) {
  autocannon(param).on("done", handleResults);
}

/**
 * @description
 * 处理接口
 * @author lizc
 * @param {*} result
 */
function handleResults(result) {
  const reportOutputPath = path.join(`./${result.title}_report.html`);
  reporter.writeReport(
    reporter.buildReport(result),
    reportOutputPath,
    (err, res) => {
      if (err) console.err("Error writting report: ", err);
      else console.log("Report written to: ", reportOutputPath);
    }
  );
}

// 启动
run(["compose_instant_batch"]);
