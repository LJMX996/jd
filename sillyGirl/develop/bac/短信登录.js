//[rule: dl ]
//[priority: 99999] 
// wuye9999: https://t.me/wuye9999a


// 登录成功后 自动更新到青龙 需要 傻妞已对接青龙
// 自动将登录成功的 京东账号和qq,wx,tg绑定 需要 傻妞已开启芝士
var proxy=false;          // true,false 是否使用代理,使用的是 /etc/sillyGirl/sets.conf 里 设置telegram机器人代理 这个代理;


var MYAPP = {};
function cl() {
    MYAPP.appid=959;
    MYAPP.qversion='1.0.0';
    MYAPP.country_code=86;
    sendText("请输入手机号: ")
    MYAPP.mobile=input(12000);
    var arr=['q', 'Q', '退出'];
    if (MYAPP.mobile && MYAPP.mobile.length===11) {
        return true;
    } else if (arr.indexOf(MYAPP.mobile)!=-1 ) {
    } else {
        sendText("输入有误, 正确的手机号码为11位数字");
    }
}


function ck() {
    var ts=new Date().getTime();
    var sub_cmd=1;
    var gsign=md5(`${MYAPP.appid}${MYAPP.qversion}${ts}36${sub_cmd}sb2cwlYyaCSN1KUv5RHG3tmqxfEb8NKN`);
    var d=`client_ver=1.0.0&gsign=${gsign}&appid=${MYAPP.appid}&return_page=https%3A%2F%2Fcrpl.jd.com%2Fn%2Fmine%3FpartnerId%3DWBTF0KYY%26ADTAG%3Dkyy_mrqd%26token%3D&cmd=36&sdk_ver=1.0.0&sub_cmd=${sub_cmd}&qversion=${MYAPP.qversion}&ts=${ts}`;
    var l=d.length;
    var res = request({
        method: "POST",
        url: "https://qapplogin.m.jd.com/cgi-bin/qapp/quick",
        headers: {
            'Host': 'qapplogin.m.jd.com',
            'cookie': '',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; V1838T Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.87 mobile Safari/537.36 hap/1.9/vivo com.vivo.hybrid/1.9.6.302 com.jd.crplandroidhap/1.0.3 ({"packageName":"com.vivo.hybrid","type":"deeplink","extra":{}})',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'content-length': l.toString(),
            'accept-encoding': '',
        },
        body: d,
        timeout: 5000,
        useproxy: proxy,
        dataType: "text",
        });
    try {
        res=JSON.parse(res);
        MYAPP.gsalt=res.data.gsalt;
        MYAPP.guid=res.data.guid;
        MYAPP.lsid=res.data.lsid;
        MYAPP.rsa_modulus=res.data.rsa_modulus;
        MYAPP.ck=`guid=${MYAPP.guid};  lsid=${MYAPP.lsid};  gsalt=${MYAPP.gsalt};  rsa_modulus=${MYAPP.rsa_modulus};`;
        return true;
    }
    catch (err) {
        sendText(`错误 ${err}`);
    }
}


function sc() {
    var ts=new Date().getTime();
    var sub_cmd=2;
    var gsign=md5(`${MYAPP.appid}${MYAPP.qversion}${ts}36${sub_cmd}${MYAPP.gsalt}`);
    var sign=md5(`${MYAPP.appid}${MYAPP.qversion}${MYAPP.country_code}${MYAPP.mobile}4dtyyzKF3w6o54fJZnmeW3bVHl0$PbXj`);
    var d=`country_code=${MYAPP.country_code}&client_ver=1.0.0&gsign=${gsign}&appid=${MYAPP.appid}&mobile=${MYAPP.mobile}&sign=${sign}&cmd=36&sub_cmd=${sub_cmd}&qversion=${MYAPP.qversion}&ts=${ts}`;
    var l=d.length;
    var res = request({
        method: "POST",
        url: "https://qapplogin.m.jd.com/cgi-bin/qapp/quick",
        headers: {
            'Host': 'qapplogin.m.jd.com',
            'cookie': MYAPP.ck,
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; V1838T Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.87 mobile Safari/537.36 hap/1.9/vivo com.vivo.hybrid/1.9.6.302 com.jd.crplandroidhap/1.0.3 ({"packageName":"com.vivo.hybrid","type":"deeplink","extra":{}})',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'content-length': l.toString(),
            'accept-encoding': '',
        },
        body: d,
        timeout: 5000,
        useproxy: proxy,
        dataType: "text",
        });
    try {
        res=JSON.parse(res);
        var err_msg=res.err_msg;
        if (err_msg) {
            sendText(`验证码发送失败 ${err_msg}`);
        } else {
            return true;
        }
    }
    catch (err) {
        sendText(`错误 ${err}`);
    }
}


function pt() {
    sendText("请输入验证码: ")
    var smscode=input(30000);
    var ts=new Date().getTime();
    var sub_cmd=3;
    var gsign=md5(`${MYAPP.appid}${MYAPP.qversion}${ts}36${sub_cmd}${MYAPP.gsalt}`);
    var d=`country_code=${MYAPP.country_code}&client_ver=1.0.0&gsign=${gsign}&smscode=${smscode}&appid=${MYAPP.appid}&mobile=${MYAPP.mobile}&cmd=36&sub_cmd=${sub_cmd}&qversion=${MYAPP.qversion}&ts=${ts}`;
    var l=d.length;
    var res = request({
        method: "POST",
        url: "https://qapplogin.m.jd.com/cgi-bin/qapp/quick",
        headers: {
            'Host': 'qapplogin.m.jd.com',
            'cookie': MYAPP.ck,
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; V1838T Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.87 mobile Safari/537.36 hap/1.9/vivo com.vivo.hybrid/1.9.6.302 com.jd.crplandroidhap/1.0.3 ({"packageName":"com.vivo.hybrid","type":"deeplink","extra":{}})',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'content-length': l.toString(),
            'accept-encoding': '',
        },
        body: d,
        timeout: 5000,
        useproxy: proxy,
        dataType: "text",
        });
    try {
        res=JSON.parse(res);
        var err_msg=res.err_msg;
        if (err_msg) {
            sendText(`登录失败 ${err_msg}`);
        } else {
            ql.pt_key=res.data.pt_key;
            ql.pt_pin=encodeURI(res.data.pt_pin);
            ql.qlck=`pt_key=${ql.pt_key};pt_pin=${ql.pt_pin};`;
            sendText(`登录成功 你的JD_COOKIE为 ${ql.qlck}`);
            return true;
        }
    }
    catch (err) {
        sendText(`错误 ${err}`);
    }
}


var ql={};
ql.host=bucketGet("qinglong","host");
ql.client_id=bucketGet("qinglong","client_id");          
ql.client_secret=bucketGet("qinglong","client_secret");  


// 返回值 Token
function ql_login(){
    var ts=new Date().getTime();
    ql.token=bucketGet("qinglong", "opentoken");
    if (!ql.token) {
        return get_qltoken();
    } else {
        var res = request({
            method: "GET",
            url: `${ql.host}/open/envs?searchValue=JD_COOKIE&t=${ts}`,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "authorization": `Bearer ${ql.token}`,
            },
            timeout: 5000,
            useproxy: proxy,
            dataType: "text",
        });
        try {
            res=JSON.parse(res);
            if (res.code===200) return true;
            else return get_qltoken();
        }
        catch (err) {
            sendText(`青龙登录失败 ${err}`);
      }
    }
}


function get_qltoken() {
  var res = request({
      method: "GET",
      url: `${ql.host}/open/auth/token?client_id=${ql.client_id}&client_secret=${ql.client_secret}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 5000,
      useproxy: proxy,
      dataType: "text",
  });
  try {
      res=JSON.parse(res);
      ql.token=res.data.token;
      bucketSet("qinglong", "opentoken", ql.token)
      return true;
  }
  catch (err) {
      sendText(`青龙登录失败 ${err}`);
  }
}


function getckitem(key) {
  var ts=new Date().getTime();
  var res = request({
      method: "GET",
      url: `${ql.host}/open/envs?searchValue=JD_COOKIE&t=${ts}`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "authorization": `Bearer ${ql.token}`
      },
      timeout: 5000,
      useproxy: proxy,
      dataType: "text",
      });
  try {
      res=JSON.parse(res);
      for (var i of res.data) {
          if (i.value.search(key) != -1) {
              return i;
          }
      }
  }
  catch (err) {
      sendText(`错误 ${err}`);
  }
}


function ql_update(text, qlid){
  var ts=new Date().getTime();
  var body=JSON.stringify({"name":"JD_COOKIE","value":text,"remarks":`用户${ImType()} ${GetUserID()}`,"_id":qlid});
  var res = request({
      method: "PUT",
      url: `${ql.host}/open/envs?t=${ts}`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "authorization": `Bearer ${ql.token}`,
        "Content-Length": body.length.toString()
      },
      body: body,
      timeout: 5000,
      useproxy: proxy,
      dataType: "text",
      });
  try {
      res=JSON.parse(res);
      if (res.code===200) return true;
      else return false;
  }
  catch (err) {
      sendText(`错误 ${err}`);
  }
}


function insert(text){
  var ts=new Date().getTime();
  var body=JSON.stringify([{"name":"JD_COOKIE","value":text,"remarks":`用户${ImType()} ${GetUserID()}`}]);
  var res = request({
      method: "POST",
      url: `${ql.host}/open/envs?t=${ts}`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "authorization": `Bearer ${ql.token}`,
        "Content-Length": body.length.toString()
      },
      body: body,
      timeout: 5000,
      useproxy: proxy,
      dataType: "text",
      });
  try {
        res=JSON.parse(res);
        if (res.code===200) return true;
        else return false;
  }
  catch (err) {
        sendText(`错误 ${err}`);
  }
}


;(function ($) {
    'use strict'
    function safeAdd (x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff)
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
      return (msw << 16) | (lsw & 0xffff)
    }
    function bitRotateLeft (num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt))
    }
    function md5cmn (q, a, b, x, s, t) {
      return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }
    function md5ff (a, b, c, d, x, s, t) {
      return md5cmn((b & c) | (~b & d), a, b, x, s, t)
    }
    function md5gg (a, b, c, d, x, s, t) {
      return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
    }
    function md5hh (a, b, c, d, x, s, t) {
      return md5cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function md5ii (a, b, c, d, x, s, t) {
      return md5cmn(c ^ (b | ~d), a, b, x, s, t)
    }
    function binlMD5 (x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << (len % 32)
      x[((len + 64) >>> 9 << 4) + 14] = len
  
      var i
      var olda
      var oldb
      var oldc
      var oldd
      var a = 1732584193
      var b = -271733879
      var c = -1732584194
      var d = 271733878
  
      for (i = 0; i < x.length; i += 16) {
        olda = a
        oldb = b
        oldc = c
        oldd = d
  
        a = md5ff(a, b, c, d, x[i], 7, -680876936)
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)
  
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
        b = md5gg(b, c, d, a, x[i], 20, -373897302)
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)
  
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
        d = md5hh(d, a, b, c, x[i], 11, -358537222)
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)
  
        a = md5ii(a, b, c, d, x[i], 6, -198630844)
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)
  
        a = safeAdd(a, olda)
        b = safeAdd(b, oldb)
        c = safeAdd(c, oldc)
        d = safeAdd(d, oldd)
      }
      return [a, b, c, d]
    }
    function binl2rstr (input) {
      var i
      var output = ''
      var length32 = input.length * 32
      for (i = 0; i < length32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
      }
      return output
    }
    function rstr2binl (input) {
      var i
      var output = []
      output[(input.length >> 2) - 1] = undefined
      for (i = 0; i < output.length; i += 1) {
        output[i] = 0
      }
      var length8 = input.length * 8
      for (i = 0; i < length8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
      }
      return output
    }
    function rstrMD5 (s) {
      return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
    }
  
    function rstrHMACMD5 (key, data) {
      var i
      var bkey = rstr2binl(key)
      var ipad = []
      var opad = []
      var hash
      ipad[15] = opad[15] = undefined
      if (bkey.length > 16) {
        bkey = binlMD5(bkey, key.length * 8)
      }
      for (i = 0; i < 16; i += 1) {
        ipad[i] = bkey[i] ^ 0x36363636
        opad[i] = bkey[i] ^ 0x5c5c5c5c
      }
      hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
      return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
    }
    function rstr2hex (input) {
      var hexTab = '0123456789abcdef'
      var output = ''
      var x
      var i
      for (i = 0; i < input.length; i += 1) {
        x = input.charCodeAt(i)
        output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
      }
      return output
    }
    function str2rstrUTF8 (input) {
      return unescape(encodeURIComponent(input))
    }
    function rawMD5 (s) {
      return rstrMD5(str2rstrUTF8(s))
    }
    function hexMD5 (s) {
      return rstr2hex(rawMD5(s))
    }
    function rawHMACMD5 (k, d) {
      return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
    }
    function hexHMACMD5 (k, d) {
      return rstr2hex(rawHMACMD5(k, d))
    }
  
    function md5 (string, key, raw) {
      if (!key) {
        if (!raw) {
          return hexMD5(string)
        }
        return rawMD5(string)
      }
      if (!raw) {
        return hexHMACMD5(key, string)
      }
      return rawHMACMD5(key, string)
    }
  
    if (typeof define === 'function' && define.amd) {
      define(function () {
        return md5
      })
    } else if (typeof module === 'object' && module.exports) {
      module.exports = md5
    } else {
      $.md5 = md5
    }
  })(this)


function main(){
    var flag=cl();
    if (!flag) return;
    flag=ck();
    if (!flag) return;
    flag=sc();
    if (!flag) return;
    flag=pt();
    if (!flag) return;
    if (ql.host && ql.client_id && ql.client_secret) {
        flag=ql_login()
        if (!flag) return;
        item=getckitem(ql.pt_pin);
        try {
            ql.qlid = item["_id"];
        } catch (err) {
            ql.qlid = false;
        }
        if (item != [] && ql.qlid) {
            if (ql_update(ql.qlck, ql.qlid)) {
              if (ImType()==="qq"){
                  bucketSet("pinQQ", ql.pt_pin, GetUserID()) //调用芝士将pin与qq绑定
              } else if (ImType()==="wx") {
                  bucketSet("pinWX", ql.pt_pin, GetUserID()) //调用芝士将pin与wx绑定
              } else if (ImType()==="tg") {
                  bucketSet("pinTG", ql.pt_pin, GetUserID()) //调用芝士将pin与tg绑定
              } else {
                  sendText(`未知平台,无法绑定芝士`);
              }
              notifyMasters(`用户${GetUserID()}: 更新账号${decodeURI(ql.pt_pin)}成功`); //通知管理员
              sendText(`更新账号成功`);
            } else {
                sendText(`更新账号失败`);
            }
        } else {
            if (insert(ql.qlck)) {
                if (ImType()==="qq"){
                    bucketSet("pinQQ", ql.pt_pin, GetUserID()) //调用芝士将pin与qq绑定
                } else if (ImType()==="wx") {
                    bucketSet("pinWX", ql.pt_pin, GetUserID()) //调用芝士将pin与wx绑定
                } else if (ImType()==="tg") {
                    bucketSet("pinTG", ql.pt_pin, GetUserID()) //调用芝士将pin与tg绑定
                } else {
                    sendText(`未知平台,无法绑定芝士`);
                }
                notifyMasters(`新增用户${GetUserID()} ${decodeURI(ql.pt_pin)}`); //通知管理员
                sendText(`新增账号成功`);
            } else {
                sendText(`新增账号失败`);
            }
        }
    }
}


main()
