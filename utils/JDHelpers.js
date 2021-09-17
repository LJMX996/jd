function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == 'object') {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == 'string') {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie');
      return [];
    }
  }
}

function randomNumber(min = 0, max = 100) {
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}

function fakeUuid() {
  return (
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10) +
    Math.random().toString(16).slice(2, 10)
  );
}

function serializeEncodeURI(obj) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}

async function getShareCode(type, num) {
  let axios = require('axios');
  let { data } = await axios.get(`https://api.jdsharecode.xyz/api/${type}/${num}`, {
    timeout: 10000
  });

  return data;
}

module.exports = {
  safeGet,
  jsonParse,
  randomNumber,
  fakeUuid,
  serializeEncodeURI,
  getShareCode,
};