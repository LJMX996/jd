/*
美丽研究院兑换
更新时间:2021-09-16
活动入口：京东app首页-美妆馆-底部中间按钮
只支持Node.js支持N个京东账号
脚本兼容: Node.js
cron 58 59 23 * * * jd_beauty_exchage.js
 */

const jd_helpers = require('./utils/JDHelpers.js');
const jd_env = require('./utils/JDEnv.js');
let $ = jd_env.env('美丽研究院兑换');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const WebSocket = require('ws');
const randomCount = $.isNode() ? 20 : 5;
$.accountCheck = true;
$.init = false;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
  cookie = '',
  message;
/**
 * 兑换京豆的数量
 */
let beansCount = process.env.JD_BEAUTY_BEANS_COUNT || 500;
/**
 * 如果兑换类型为2、3需要填上兑换的物品名称
 */
let benefitName = process.env.JD_BEAUTY_BENEFIT_NAME || '';
/**
 * 兑换物品的类型 1-京豆 2、3-物品
 */
let benefitType = process.env.JD_BEAUTY_BENEFITTYPE || 1;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jd_helpers.jsonParse($.getdata('CookiesJD') || '[]').map((item) => item.cookie)].filter((item) => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
    console.log(`\n❗❗❗❗❗❗\n注意:本仓库偷助力，偷CK，今天用这个仓库，明天你一觉醒来服务器就被我偷走了🌝🌝🌚🌚\n❗❗❗❗❗❗\n`);
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', { 'open-url': 'https://bean.m.jd.com/' });
    return;
  }
  if (!$.isNode()) {
    $.msg($.name, 'iOS端不支持websocket，暂不能使用此脚本', '');
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await $.totalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, { 'open-url': 'https://bean.m.jd.com/' });

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue;
      }
      await accountCheck();
      while (!$.hasDone) {
        await $.wait(1000);
      }
      if ($.accountCheck) {
        await jdBeauty();
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '');
  })
  .finally(() => {
    $.done();
  });

async function accountCheck() {
  $.hasDone = false;
  console.log(`***检测账号是否黑号***`);
  await getIsvToken();
  await getIsvToken2();
  await getToken();
  if (!$.token) {
    console.log(`\n\n提示：请尝试换服务器ip或者设置"xinruimz-isv.isvjcloud.com"域名直连，或者自定义UA再次尝试(环境变量JD_USER_AGENT)\n\n`);
    process.exit(0);
    return;
  }
  let client = new WebSocket(`wss://xinruimz-isv.isvjcloud.com/wss/?token=${$.token}`, null, {
    headers: {
      'user-agent': $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : require('./USER_AGENTS').USER_AGENT
        : $.getdata('JDUA')
        ? $.getdata('JDUA')
        : 'jdapp;iPhone;10.0.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
    },
  });
  client.onopen = async () => {
    console.log(`美容研究院服务器连接成功`);
    client.send(getMsg('_init_', { source: 1 }));
    await $.wait(1000);
    client.send(getMsg('get_user', { source: 1 }));
  };
  client.onmessage = async function (e) {
    if (e.data !== 'pong' && e.data && jd_helpers.safeGet(e.data)) {
      let vo = JSON.parse(e.data);
      if (vo.action === '_init_') {
        let vo = JSON.parse(e.data);
        if (vo.msg === '风险用户') {
          $.accountCheck = false;
          // $.init=true;
          client.close();
          console.log(`${vo.msg}，跳过此账号`);
        }
      } else if (vo.action === 'get_user') {
        // $.init=true;
        $.accountCheck = true;
        client.close();
        console.log(`${vo.msg}，账号正常`);
      }
    }
    client.onclose = (e) => {
      $.hasDone = true;
      // console.log(client.readyState);
      console.log('服务器连接关闭');
    };
    await $.wait(1000);
  };
}

async function jdBeauty() {
  $.hasDone = false;
  await mr();
  while (!$.hasDone) {
    await $.wait(1000);
  }
  await showMsg();
}

async function mr() {
  $.coins = 0;
  $.tokens = [];
  $.pos = [];
  $.needs = [];
  let client = new WebSocket(`wss://xinruimz-isv.isvjcloud.com/wss/?token=${$.token}`, null, {
    headers: {
      'user-agent': $.isNode()
        ? process.env.JD_USER_AGENT
          ? process.env.JD_USER_AGENT
          : require('./USER_AGENTS').USER_AGENT
        : $.getdata('JDUA')
        ? $.getdata('JDUA')
        : 'jdapp;iPhone;10.0.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
    },
  });
  console.log(`wss://xinruimz-isv.isvjcloud.com/wss/?token=${$.token}`);
  client.onopen = async () => {
    console.log(`美容研究院服务器连接成功`);
    client.send(getMsg('_init_', { source: 1 }));
    client.send(getMsg('stats', { source: 'meizhuangguandibudaohang' }));
    while (!$.init) {
      client.send(`ping`);
      await $.wait(1000);
    }
   
    // 获取个人信息
    client.send(getMsg('get_user', { source: 1 }));
    await $.wait(1000);
    // 获得福利中心
    client.send(getMsg('get_benefit'));
    client.send(getMsg('collect_coins'));
  };

  client.onclose = () => {
    console.log(`本次运行获得美妆币${$.coins}`);
    console.log('服务器连接关闭');
    $.init = true;
    $.hasDone = true;
  };
  client.onmessage = async function (e) {
    if (e.data !== 'pong' && e.data && jd_helpers.safeGet(e.data)) {
      let vo = JSON.parse(e.data);
      await $.wait(jd_helpers.randomNumber(2, 5) * 1000 + jd_helpers.randomNumber(200, 500));
      console.log(`\n开始任务：${JSON.stringify(vo.action)}`);

      if (vo.code !== 200) {
        console.log(`${vo.action}错误，错误信息：${JSON.stringify(vo.msg)}`);
        return;
      }

      switch (vo.action) {
        case 'get_user':
          $.userInfo = vo.data;
          $.total = vo.data.coins;
          if ($.userInfo.newcomer === 0) {
            console.log(`去做新手任务`);
            for (let i = $.userInfo.step; i < 15; ++i) {
              client.send(getMsg('newcomer_update'));
              await $.wait(500);
            }
          } else $.init = true;
          $.level = $.userInfo.level;
          console.log(`当前美妆币${$.total}，用户等级${$.level}`);
          break;
        case 'complete_task':
        case 'action':
        case 'submit_answer':
        case 'check_up_receive':
          console.log(`任务完成成功，获得${vo.data.coins}美妆币`);
          if (vo.data.coins) $.coins += vo.data.coins;
          $.total = vo.data.user_coins;
          break;
        case 'collect_coins':
          console.log(`收取成功，获得${vo['data']['coins']}美妆币，当前总美妆币：${vo['data']['user_coins']}\n`);
          break;
        case 'get_benefit':
          for (let benefit of vo.data) {
            // console.log(`benefit:${JSON.stringify(benefit)}`);
            if (benefit.type != benefitType) {
              continue;
            }

            if (benefit.stock <= 0) {
              console.log(`${benefit.name} 库存不足，数量:${benefit.stock}`);
              continue;
            }
            if (benefitType == 1 && benefit?.setting?.beans_count * benefit.day_limit == beansCount) {
              console.log(`开始兑换${benefit.name}`)
              for (let i = benefit.day_exchange_count == 0 ? 1 : benefit.day_exchange_count; i <= benefit.day_limit; i++) {
                client.send(`{"msg":{"type":"action","args":{"benefit_id":${benefit.id}},"action":"to_exchange"}}`);
              }
              break;
            } else if ([2, 3].includes(benefitType) && benefit.name.includes(benefitName) && benefit.day_exchange_count < benefit.day_limit) {
              console.log(`开始兑换${benefit.name}`)
              client.send(`{"msg":{"type":"action","args":{"benefit_id":${benefit.id}},"action":"to_exchange"}}`);
              break;
            }
          }
          break;
        case 'to_exchange':
          if (vo?.data) {
            console.log(`兑换${vo?.data?.coins / -100}京豆成功;${JSON.stringify(vo)}`);
          } else {
            console.log(`兑换京豆失败：${JSON.stringify(vo)}`);
          }
          await $.wait(2000);
          break;
        case 'employee':
          console.log(`${vo.msg}`);
          break;
      }
    }
  };
}

function getIsvToken() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    body: 'body=%7B%22to%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%5C/?channel%3Dmeizhuangguandibudaohang%26collectionId%3D96%26tttparams%3DYEyYQjMIeyJnTG5nIjoiMTE4Ljc2MjQyMSIsImdMYXQiOiIzMi4yNDE4ODIifQ8%253D%253D%26un_area%3D12_904_908_57903%26lng%3D118.7159742308471%26lat%3D32.2010317443041%22%2C%22action%22%3A%22to%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&sign=b0aac3dd04b1c6d68cee3d425e27f480&st=1610161913667&sv=111',
    headers: {
      Host: 'api.m.jd.com',
      accept: '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      Cookie: cookie,
    },
  };
  return new Promise((resolve) => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`);
          console.log(`${JSON.stringify(err)}`);
        } else {
          if (jd_helpers.safeGet(data)) {
            data = JSON.parse(data);
            $.isvToken = data['tokenKey'];
            console.log(`isvToken:${$.isvToken}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function getIsvToken2() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    body: 'body=%7B%22url%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&sign=6eb3237cff376c07a11c1e185761d073&st=1610161927336&sv=102&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D',
    headers: {
      Host: 'api.m.jd.com',
      accept: '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      Cookie: cookie,
    },
  };
  return new Promise((resolve) => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (jd_helpers.safeGet(data)) {
            data = JSON.parse(data);
            $.token2 = data['token'];
            console.log(`token2:${$.token2}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

async function getToken() {
  let axios = require('axios');
  await axios.post('https://xinruimz-isv.isvjcloud.com/api/auth', {
    token: $.token2,
    source: '01'
  }).then((resp) => $.token = resp.data.access_token);
}

function showMsg() {
  return new Promise((resolve) => {
    message += `本次运行获得美妆币${$.coins}枚\n当前美妆币${$.total}`;
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve();
  });
}

function getMsg(action, args = {}) {
  content = {
    msg: {
      type: 'action',
      args: {},
      action: '',
    },
  };
  if (typeof args != 'undefined') {
    content.msg.args = args;
  }

  if (typeof action != 'undefined') {
    content.msg.action = action;
  }

  console.log(JSON.stringify(content));

  return JSON.stringify(content);
}
