/*

一共有2个变量
jd_zdjr_activityId  活动ID 必需
jd_zdjr_activityUrl 活动地址 必需

已适配docker

需要配合重写获取=>活动id、活动地址

https://\w+-isv.isvjcloud.com/wxTeam/shopInfo url script-request-body smiek_jd_zdjr.js

mitm
*-isv.isvjcloud.com

*/

let jd_zdjr_activityId = '8052097b29f74692abee0fdb71e499bd'// 活动ID
let jd_zdjr_activityUrl = 'https://cjhydz-isv.isvjcloud.com'// 活动地址

const $ = new Env('组队瓜分京豆');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [],
    cookie = '',
    message = '',
    messageTitle = '';
activityId = $.getdata('jd_smiek_zdjr_activityId') ? $.getdata('jd_smiek_zdjr_activityId') : jd_zdjr_activityId;
activityUrl = $.getdata('jd_smiek_zdjr_activityUrl') ? $.getdata('jd_smiek_zdjr_activityUrl') : jd_zdjr_activityUrl;
let activityCookie = '';
if ($.isNode()) {
    if (process.env.jd_zdjr_activityId) activityId = process.env.jd_zdjr_activityId;
    if (process.env.jd_zdjr_activityUrl) activityUrl = process.env.jd_zdjr_activityUrl;
    if (JSON.stringify(process.env).indexOf('GITHUB') > -0x1) process.exit(0);
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let isGetCookie = typeof $request !== 'undefined';
if (isGetCookie) {
    GetCookie();
    $.done();
}
!(async () => {
    if (!activityId) {
        $.msg($.name, '', '活动id不存在');
        $.done();
        return;
    }
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\x0a直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            'open-url': 'https://bean.m.jd.com/'
        });
        return;
    }
    $.memberCount = 0;
    messageTitle += '活动id:\n' + activityId + '\n';
    $.toactivity = [];
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            console.log('\n******开始【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '*********\n');
            if (!$.isLogin) {
                $.msg($.name, '【提示】cookie已失效', '京东账号' + $.index + '\x20' + ($.nickName || $.UserName) + '\n请重新登录获取\nhttps://bean.m.jd.com/', {
                    'open-url': 'https://bean.m.jd.com/'
                });
                if ($.isNode()) {
                    await notify.sendNotify($.name + 'cookie已失效 - ' + $.UserName, '京东账号' + $.index + '\x20' + $.UserName + '\n请重新登录获取cookie');
                }
                continue;
            }
            await jrzd();
            if (!$.toactivity || $.maxTeam) {
                break;
            }
        }
    }
    messageTitle += '队伍人数 ' + $.memberCount + '\n';
    await showMsg();
})().catch((e) => {
    $.log('', ` ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
});

async function jrzd() {
    getUA()
    $.sid = '',
        $.userId = '',
        $.Token = '',
        $.Pin = '';
    $.saveTeam = ![];
    await getCk();
    await getToken();
    if($.Token == ''){
        console.log('获取[token]失败！')
        return
    }
    $.AUTH_C_USER = "4oSXfUlJ1qzTqmn3/gy2c9A1Drq3za4lh6LFLfledF1cdSiqMbCx5edEEaL3RnCSkdK3rLBQpEQH9V4tdrrh0w"

    await getSimpleActInfoVo()
    await getshopInfo();
    if ($.sid && $.userId) {
        await getToken();
        if ($.Token) await getPin();
        console.log('pin:' + $.Pin);
        await getUserInfo();
        await getTeam();
        await $['wait'](1000);
        if ($.maxTeam) {
            console.log('队伍已满员');
            return;
        }
    } else {
        console.log('【京东账号' + $.index + '】 未能获取活动信息');
        message += '【京东账号' + $.index + '】 未能获取活动信息\n';
    }
}
function token() {
    return new Promise(resolve => {
        let get = {
            url:`https://cjhydz-isv.isvjcloud.com/wxCommonInfo/token`,
            headers: {
                "Cookie": `${activityCookie} ${cookie}`,
                "Referer":`https://cjhydz-isv.isvjcloud.com/lzclient/dz/2021jan/eliminateGame/0816eliminate/?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
                "User-Agent": $.UA,
            }
        }
        $.get(get, async(err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} cookie API请求失败，请检查网路重试`)
                } else {
                    let LZ_TOKEN_KEY = ''
                    let LZ_TOKEN_VALUE = ''
                    let setcookies = resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || ''
                    let setcookie = ''
                    if(setcookies){
                        if(typeof setcookies != 'object'){
                            setcookie = setcookies.split(',')
                        }else setcookie = setcookies
                        for (let ck of setcookie) {
                            let name = ck.split(";")[0].trim()
                            if(name.split("=")[1]){
                                if(name.indexOf('LZ_TOKEN_KEY=')>-1) LZ_TOKEN_KEY = name.replace(/ /g,'')+';'
                                if(name.indexOf('LZ_TOKEN_VALUE=')>-1) LZ_TOKEN_VALUE = name.replace(/ /g,'')+';'
                            }
                        }
                    }
                    if(LZ_TOKEN_KEY && LZ_TOKEN_VALUE) activityCookie = `${LZ_TOKEN_KEY} ${LZ_TOKEN_VALUE}`
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getUA() {
    $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}

function getSimpleActInfoVo() {
    return new Promise(resolve => {
        let body = `activityId=${$.activityId}`
        $.post(taskPostUrl('/customer/getSimpleActInfoVo',body), async(err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} getSimpleActInfoVo API请求失败，请检查网路重试`)
                } else {
                    if (resp.status == 200) {
                        let cookies = resp.headers['set-cookie']
                        $.LZ_TOKEN_KEY = cookies[0].substring(cookies[0].indexOf("=") + 1, cookies[0].indexOf(";"))
                        $.LZ_TOKEN_VALUE = cookies[1].substring(cookies[1].indexOf("=") + 1, cookies[1].indexOf(";")).replace("==","")
                        activityCookie = "LZ_TOKEN_KEY=" + $.LZ_TOKEN_KEY + ";LZ_TOKEN_VALUE=" + $.LZ_TOKEN_VALUE
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function showMsg() {
    return new Promise(resolve => {
        let openAppUrl = openAppUrl();
        console.log('运行完毕');
        console.log(openAppUrl);
        $.msg($.name, '' + $['shopName'], '' + messageTitle + message + ' \n点击弹窗跳转到京东APP活动页面', {
            'open-url': openAppUrl
        });
        resolve();
    });
}

function openAppUrl() {
    let url = activityUrl + '/wxTeam/activity?activityId=' + activityId;
    let openApp = url;
    if (url.substr(0, 5) == 'https') {
        let param = {
            'category': 'jump',
            'des': 'getCoupon',
            'url': url.substr(8)
        };
        openApp = 'openApp.jdMobile://virtual?params=' + encodeURIComponent(JSON.stringify(param));
    } else if (url.substr(0, 4) == 'http') {
        let param = {
            'category': 'jump',
            'des': 'getCoupon',
            'url': url.substr(7)
        };
        openApp = 'openApp.jdMobile://virtual?params=' + encodeURIComponent(JSON.stringify(param));
    }
    return openApp;
}

function getCk() {
    return new Promise(resolve => {
        let options = {
            'url': activityUrl + '/wxTeam/activity?activityId=' + activityId,
            'headers': {
                'Cookie': cookie,
                'User-Agent': $.UA
            }
        };
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log('' + JSON.stringify(err));
                    console.log($.name + ' cookie API请求失败，请检查网路重试');
                } else {
                    if (resp.status == 200) {
                        let cookies = resp.headers['set-cookie']
                        $.LZ_TOKEN_KEY = cookies[0].substring(cookies[0].indexOf("=") + 1, cookies[0].indexOf(";"))
                        $.LZ_TOKEN_VALUE = cookies[1].substring(cookies[1].indexOf("=") + 1, cookies[1].indexOf(";")).replace("==","")
                        activityCookie = "LZ_TOKEN_KEY=" + $.LZ_TOKEN_KEY + ";LZ_TOKEN_VALUE=" + $.LZ_TOKEN_VALUE
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function getToken() {
    return new Promise(resolve => {
        let body = 'adid=7B411CD9-D62C-425B-B083-9AFC49B94228&area=16_1332_42932_43102&body=%7B%22url%22%3A%22https%3A%5C/%5C/cjhydz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167541&client=apple&clientVersion=9.4.0&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=48&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=11&screen=750%2A1334&sign=60bde51b4b7f7ff6e1bc1f473ecf3d41&st=1613720203903&sv=110&uts=0f31TVRjBStG9NoZJdXLGd939Wv4AlsWNAeL1nxafUsZqiV4NLsVElz6AjC4L7tsnZ1loeT2A8Z5/KfI/YoJAUfJzTd8kCedfnLG522ydI0p40oi8hT2p2sNZiIIRYCfjIr7IAL%2BFkLsrWdSiPZP5QLptc8Cy4Od6/cdYidClR0NwPMd58K5J9narz78y9ocGe8uTfyBIoA9aCd/X3Muxw%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=9cf90c586c4468e00678545b16176ed2';
        $.post(taskUrl('?functionId=isvObfuscator', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + ' 2 API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.code == 0 && data.token) {
                                $.Token = data.token;
                            } else {
                                console.log('异常2：' + JSON.stringify(data));
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function getPin() {
    return new Promise(resolve => {
        let body = 'userId=' + $.userId + '&token=' + $.Token + '&fromType=APP';
        $.post(taskPostUrl('/customer/getMyPing', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + ' 3 API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.result && data.data) {
                                $.Pin = data.data.secretPin;
                            } else {
                                console.log('异常3：' + JSON.stringify(data));
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function getshopInfo() {
    return new Promise(resolve => {
        $.post(taskPostUrl('/wxTeam/shopInfo', 'activityId=' + activityId),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + ' 1 API请求失败，请检查网路重试');
                    } else {
                        if (data && safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.data) {
                                $.sid = data.data.sid;
                                $.userId = data.data.userId;
                                $['shopName'] = data.data['shopName'];
                            } else {
                                console.log('异常1：' + JSON.stringify(data));
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function joinShop() {
    return new Promise(resolve => {
        let body = 'venderId=' + $.userId + '&buyerPin=' + encodeURIComponent($.Pin);
        $.post(taskPostUrl('/mc/new/brandCard/common/shopAndBrand/getOpenCardInfo', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + 'API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.result && data.data) {
                                if (data.data.openCardLink) {
                                    let channel = data.data.openCardLink.match(/channel=(\d+)/);
                                    const body = {
                                        'venderId': $.userId,
                                        'shopId': $.sid,
                                        'bindByVerifyCodeFlag': 1,
                                        'registerExtend': {},
                                        'writeChildFlag': 0,
                                        'channel': channel[1]
                                    };
                                    let url = 'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=' + encodeURIComponent(JSON.stringify(body)) + '&client=H5&clientVersion=9.2.0&uuid=88888&jsonp=jsonp_1613718333317_54489';
                                    let referer = '' + data.data.openCardLink;
                                    await jiaru(url, referer);
                                }
                            } else {
                                console.log('异常4：' + JSON.stringify(data));
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function jiaru(url, referer) {
    return new Promise(resolve => {
        let options = {
            'url': url,
            'headers': {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-cn',
                'Connection': 'keep-alive',
                'Host': 'api.m.jd.com',
                'Referer': referer,
                'Cookie': cookie,
                'User-Agent': $.UA
            }
        };
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log('' + JSON.stringify(err));
                    console.log($.name + '\x20入会\x20API请求失败，请检查网路重试');
                } else {
                    $.log(data);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function getUserInfo() {
    return new Promise(resolve => {
        let body = 'pin=' + encodeURIComponent($.Pin);
        $.post(taskPostUrl('/wxActionCommon/getUserInfo', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + '\x206-1\x20API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.result && data.data) {
                                $.attrTouXiang = data.data.yunMidImageUrl ? data.data.yunMidImageUrl : 'https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg'
                            } else {
                                console.log('异常6-2：' + JSON.stringify(data));
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function getTeam() {
    return new Promise(resolve => {
        let body = 'activityId=' + activityId + '&pin=' + encodeURIComponent($.Pin);
        if ($.signUuid) body += '&signUuid=' + $.signUuid;
        $.post(taskPostUrl('/wxTeam/activityContent', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + ' 5 API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.result && data.data) {
                                if (new Date(data.data.active.endTimeStr.replace(/-/g, '/')).getTime() < new Date().getTime()) {
                                    $.toactivity = ![];
                                    console.log('活动结束');
                                    messageTitle += '活动结束\n';
                                    resolve();
                                } else {
                                    if (!data.data.canCreate && data.data.list == null) message += '人数已满\n';
                                    if (data.data.share) {
                                        $.memberCount = parseInt(data.data.share.memberCount, 10) + 1;
                                    } else {
                                        $.memberCount = 0;
                                    }
                                    if ($.index == 1) {
                                        $.saveTeam = true;
                                        $.teamNum = data.data.active.actRule.match(/最多可以组建(\d+)个战队/);
                                        if ($.teamNum) {
                                            $.teamNum = $.teamNum[1];
                                            messageTitle += '最多可以组建' + $.teamNum + '个战队';
                                        }
                                    }
                                    if ($.signUuid) {
                                        $.log('加入队伍 id: ' + $.signUuid);
                                        await joinTeam();
                                    }
                                    if ($.saveTeam) {
                                        if (data.data.canCreate) {
                                            await saveTeam();
                                        } else {
                                            $.signUuid = data.data.signUuid;
                                            messageTitle += '队伍id: ' + $.signUuid + '\x0a';
                                            message += '【京东账号' + $.index + '】 创建队伍id: ' + $.signUuid;
                                            $.log('队伍id: ' + $.signUuid);
                                            $.wait(1000)
                                            $.log('加入队伍 id: ' + $.signUuid);
                                            await joinTeam();
                                        }
                                    }
                                }
                            } else {
                                console.log('异常5：' + JSON.stringify(data));
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve(resolve);
                }
            });
    });
}

function saveTeam(count = 0x0) {
    return new Promise(resolve => {
        let pin = encodeURIComponent($.Pin);
        if (count == 1) pin = encodeURIComponent(encodeURIComponent($.Pin));
        let body = 'activityId=' + activityId + '&pin=' + pin + '&pinImg=' + encodeURIComponent($.attrTouXiang);
        $.post(taskPostUrl('/wxTeam/saveCaptain', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + '\x206\x20API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.result && data.data) {
                                message += '【京东账号' + $.index + '】 创建队伍id: ' + data.data.signUuid + ' ';
                                console.log('创建队伍成功 id: ' + data.data.signUuid);
                                $.signUuid = data.data.signUuid;
                                messageTitle += '队伍id: ' + $.signUuid + ' ';
                            } else {
                                console.log('异常6：' + JSON.stringify(data));
                                if (data.errorMessage.indexOf('不是店铺会员') > -1 && count != 3) {
                                    await joinShop();
                                    await saveTeam(3);
                                } else if (data.errorMessage.indexOf('奖品与您擦肩而过') > -1 && count == 0) {
                                    await saveTeam(1);
                                }
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function joinTeam(count = 0x0) {
    return new Promise(resolve => {
        let pin = encodeURIComponent(encodeURIComponent($.Pin));
        if (count == 1) pin = encodeURIComponent($.Pin);
        let body = 'activityId=' + activityId + '&signUuid=' + $.signUuid + '&pin=' + pin + '&pinImg=' + encodeURIComponent($.attrTouXiang);
        $.post(taskPostUrl('/wxTeam/saveMember', body),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log('' + JSON.stringify(err));
                        console.log($.name + '\x207\x20API请求失败，请检查网路重试');
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.result && data.data) {
                                message += '【京东账号' + $.index + '】 加入队伍\n';
                                $.log('加入队伍成功');
                            } else {
                                if (data.errorMessage.indexOf('不是店铺会员') > -1 && count != 3) {
                                    await joinShop();
                                    await joinTeam(3);
                                } else if (data.errorMessage.indexOf('队伍已经满员') > -1) {
                                    $.maxTeam = true;
                                } else if (data.errorMessage.indexOf('奖品与您擦肩而过') > -1 && count == 0) {
                                    await joinTeam(1);
                                } else {
                                    console.log('异常7：' + JSON.stringify(data));
                                    message += '【京东账号' + $.index + '】\x20' + data.errorMessage + '\x0a';
                                }
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
    });
}

function taskPostUrl(url, body) {
    return {
        'url': '' + activityUrl + url,
        'body': body,
        'headers': {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-cn',
            'Connection': 'keep-alive',
            'Host':'cjhydz-isv.isvjcloud.com',
            'Origin':'https://cjhydz-isv.isvjcloud.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': activityUrl + '/wxTeam/activity?activityId=' + activityId,
            'Cookie': cookie + activityCookie + ";IsvToken="+$.Token + ";AUTH_C_USER="+$.AUTH_C_USER,
            'User-Agent': $.UA
        }
    };
}

function taskUrl(url, body) {
    return {
        'url': 'https://api.m.jd.com/client.action' + url,
        'body': body,
        'headers': {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-cn',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.m.jd.com',
            'Cookie': cookie,
            'User-Agent': $.UA
        }
    };
}

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            'url': 'https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2',
            'headers': {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-cn',
                'Connection': 'keep-alive',
                'Cookie': cookie,
                'Referer': 'https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2',
                'User-Agent': $.UA
            }
        };
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log('' + JSON.stringify(err));
                    console.log($.name + '\x20API请求失败，请检查网路重试');
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.retcode === 0xd) {
                            $.isLogin = false;
                            return;
                        }
                    } else {
                        console.log('京东服务器返回空数据');
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == 'object') {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log('京东服务器访问数据为空，请检查自身设备网络情况');
        return false;
    }
}

function jsonParse(str) {
    if (typeof strv == 'string') {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie');
            return [];
        }
    }
}

function GetCookie() {
    if ($request.url.indexOf('/wxTeam/shopInfo') > -1) {
        if ($request.body) {
            let activityId = $request.body.match(/activityId=([a-zA-Z0-9._-]+)/);
            if (activityId) {
                let urls = $request.url.split('/');
                console.log('activityId: ' + activityId[1]);
                console.log('activityUrl: ' + urls[0] + '//' + urls[2]);
                $['setdata'](activityId[1], 'jd_smiek_zdjr_activityId');
                $['setdata'](urls[0] + '//' + urls[2], 'jd_smiek_zdjr_activityUrl');
                $.msg($.name, '获取activityId: 成功', 'activityId:' + activityId[1] + '\nactivityUrl:' + urls[0] + '//' + urls[2]);

            } else {
                $.msg($.name, '找不到activityId', '');
            }
        }
    }
};

// prettier-ignore
function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);

    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {url: t} : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `${this.name}, 开始!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({url: t}, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {script_text: t, mock_type: "cron", timeout: r},
                    headers: {"X-Key": o, Accept: "*/*"}
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => {
                const {message: s, response: i} = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t)); else if (this.isNode()) {
                this.initGotEnv(t);
                const {url: s, ...i} = t;
                this.got.post(s, i).then(t => {
                    const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                    e(null, {status: s, statusCode: i, headers: r, body: o}, o)
                }, t => {
                    const {message: s, response: i} = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
                        return {openUrl: e, mediaUrl: s}
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
                        return {"open-url": e, "media-url": s}
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {url: e}
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============系统通知=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `${this.name}, 错误!`, t.stack) : this.log("", `${this.name}, 错误!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `${this.name}, 结束!  ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
