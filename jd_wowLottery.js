/*
wow抽奖，实物。
入口：窝者家居 - 窝者0元抽奖
周期：不清楚，可能一周一次。本脚本会加购，请谨慎使用。
注意：因无法判断是否已经参加，所以重复运行脚本，即使已经完成加购也会会正常加购。
 */
const $ = new Env('wow抽奖');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;

const got = require("got");
const now = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000;

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      $.exit = false;
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await listAll()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function listAll(){
  try{
	  let functionId = `listActivity`
	  let body = encodeURI(`"listType":1,"pageNum":0,"pageSize":10,"source":3`)
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(detail)
	  $.sourceList = detail.data.data
	  $.ids = [] //先获取id集合
	  for (let a of $.sourceList) {
		  activityId = a.activityId
		  $.ids.push(activityId)
	  }
	  for (let vo of $.sourceList) {
		  $.prize = vo.koiReward.prizeContent
		  endTime = vo.endTime
		  console.log(`\n【奖品】${$.prize}`)
		  console.log(`【结束时间】${new Date(endTime).format("yyyy-MM-dd hh:mm:ss")}`)
		  activityId = vo.activityId
		  await getShopId(activityId)
	  }
  }catch(e){
	  console.log(e)
  }
}

async function taskConfig(id){
  try{
	  let functionId = `getConfigInfo`
	  let body = encodeURI(`"activityId":${id}`)
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(detail)
	  taskList = detail.data
	  //console.log(taskList)
	  console.log(`开始加购 ---`)
	  shopSkuIds = taskList.shopSkuIds
	  skuBody = encodeURI(`"activityId":${id},"task_type":10,"skuIdList":"${shopSkuIds}"`)
	  await dotask(skuBody)
	  await $.wait(1000)
	  await lotterySource(body)
	  await $.wait(1000)
	  await getCode(body)
	  await $.wait(1000)
	  console.log(`开始看频道 ---`)
	  actThemeIds = taskList.actThemeIds //浏览频道
	  ThemeId = []
	  ThemeId = actThemeIds.split(",")
	  for (let t of ThemeId) {
		  taskBody = encodeURI(`"activityId":${id},"task_type":6,"themeId":"${t}"`)
		  await dotask(taskBody)
		  await $.wait(1000)
	  }
	  finishBody = encodeURI(`"activityId":${id},"task_type":7,"themeId":"${ThemeId[0]}"`)
	  await dotask(finishBody) 
	  await $.wait(1000)
	  await lotterySource(body)
	  await $.wait(1000)
	  await getCode(body)
  }catch(e){
	  console.log(e)
  }
}

async function dotask(body){
  try{
	  let functionId = `doActivityTask`
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(JSON.stringify(detail))
	  console.log(detail.message)
  }catch(e){
	  console.log(e)
  }
}

async function getShopId(id){
  try{
	  let functionId = `getShopListByActivityId`
	  let body = encodeURI(`"activityId":${id}`)
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(detail)
	  console.log(`尝试参加其他活动 ---`)
	  if ($.ids) {
		  for (let m = 0; m < $.ids.length; m++) {
			  if (id == $.ids[m]) num = m+1
		  }
	  }
	  if ($.ids[num] !== undefined) {
		  let eventBody = encodeURI(`"activityId":${$.ids[num]},"task_type":9`)
		  await dotask(eventBody)
		  await $.wait(1000)
		  await partActivity(body)
	  } else {
		  let eventBody = encodeURI(`"activityId":${$.ids[0]},"task_type":9`)
		  await dotask(eventBody)
		  await $.wait(1000)
		  await partActivity(body)
	  }
	  await $.wait(1000)
	  console.log(`开始关注店铺 ---`)
	  shopId = detail.shopId
	  await followShop(id,shopId)
	  await $.wait(1000)
	  await lotterySource(body)
	  await $.wait(1000)
	  await partActivity(body)
	  await $.wait(1000)
	  await taskConfig(id) //顺便做浏览和加购
	  console.log(`开始浏览店铺 ---`)
	  browseBody = encodeURI(`"activityId":${id},"task_type":5,"shopId":${shopId}`)
	  await dotask(browseBody)
	  await $.wait(1000)
	  await lotterySource(body)
	  await $.wait(1000)
	  await getCode(body)
  }catch(e){
	  console.log(e)
  }
}

async function followShop(id,shopId){
  try{
	  let functionId = `followShopByActivityId`
	  let body = encodeURI(`"activityId":${id},"shopId":${shopId}`)
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(JSON.stringify(detail))
	  console.log(detail.message)
  }catch(e){
	  console.log(e)
  }
}

async function lotterySource(body){
  try{
	  let functionId = `getExternalMyLotteryCodeSource`
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(JSON.stringify(detail))
	  console.log(`刷新页面${detail.message}`)
  }catch(e){
	  console.log(e)
  }
}

async function partActivity(body){
  try{
	  let functionId = `partActivity`
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(JSON.stringify(detail))
	  console.log(`获得抽奖码：${detail.data.lotteryCode}`)
  }catch(e){
	  console.log(e)
  }
}

async function getCode(body){
  try{
	  let functionId = `getExternalMyLotteryCode`
	  detail = await got(taskUrl(functionId,body)).then(response => {
		  //console.log(response.url)
		  a = response.body
		  b = JSON.parse(a.toString().replace(/\s*/g,"").match(/\((\S*)\)/)[1])
		  return b;
		}).catch(error => {
		  console.log(error.response);
	  });
	  //console.log(JSON.stringify(detail))
	  console.log(`【已获得抽奖码】${detail.data.data}`)
  }catch(e){
	  console.log(e)
  }
}

//taskUrl
function taskUrl(functionId,body) {
  return {
    url: `https://api.m.jd.com/api?appid=fan_box&t=${now}&loginType=2&functionId=${functionId}&body={${body}}&jsonp=jsonp`+(1000+getNum()),
    headers: {
	  'Cookie': cookie,
	  'Accept-Encoding' : `gzip, deflate, br`,
	  'Connection' : `keep-alive`,
	  'Host': `api.m.jd.com`,
      'Accept': `*/*`,
      'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;10.0.2;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
	  'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/qxZ8zmmGtkofMZsyGpcEthhgpAr/index.html`,
      'Accept-Language': `zh-cn`
    }
  }
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

//时间格式化
Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
} 

//函数每调用一次就加1
function getNum() {
	var i = 0;
	getNum = function() {
		return i++;
	};
	return i++;
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}

function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
