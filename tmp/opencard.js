/*
通用开卡，请先群里设置配置(有啥问题群里问)
*/
const $ = new Env('通用开卡[普通]');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let UA = require('./USER_AGENTS.js').USER_AGENT;
const notify = $.isNode() ? require('./sendNotify') : '';

const got = require('got');
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
  if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0)
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async() => {
    var _0x46874c = {
        'cnknp': function(_0x5b7cbe, _0x54a342) {
            return _0x5b7cbe + _0x54a342;
        },
        'xpBhV': function(_0x4a260a, _0x3cb2f7) {
            return _0x4a260a * _0x3cb2f7;
        },
        'IbwPk': function(_0x1716ff, _0x2e7e3d) {
            return _0x1716ff + _0x2e7e3d;
        },
        'PQFVG': 'text/plain; Charset=UTF-8',
        'sNAkU': 'https://api.m.jd.com',
        'CqsDy': 'api.m.jd.com',
        'bxQGk': '*/*',
        'ktIqj': 'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1',
        'qGEBx': 'application/x-www-form-urlencoded',
        'EiMsm': function(_0x265522, _0x447565) {
            return _0x265522(_0x447565);
        },
        'jeLFV': function(_0x5b659e, _0x3f7467) {
            return _0x5b659e(_0x3f7467);
        },
        'xEqlb': function(_0x2b26cf, _0x5ca8d5) {
            return _0x2b26cf !== _0x5ca8d5;
        },
        'RwLCG': 'XPEtf',
        'EqJgw': '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取',
        'dNQPR': 'https://bean.m.jd.com/',
        'urWlo': 'KOgPa',
        'EIshg': 'FhwFP',
        'EZMUL': function(_0x180a80, _0x468bbb) {
            return _0x180a80 === _0x468bbb;
        },
        'wrLiM': 'oDWKh',
        'lUBkp': '配置加载失败',
        'OqxZQ': 'mgorM',
        'OgGQx': 'PZAnW',
        'dzQcx': 'uLutw',
        'ekLHF': '请检查配置！',
        'qezYP': '配置读取失败，请与作者取得联系，或加入qq群',
        'qoxNv': function(_0x139e9e, _0x482b46) {
            return _0x139e9e < _0x482b46;
        },
        'nOcnC': 'WKilb',
        'oARkN': 'UIfZH',
        'jWkBD': function(_0x1a1856, _0x148f4d) {
            return _0x1a1856(_0x148f4d);
        },
        'SQXEF': function(_0x5b2c4a, _0x53d877) {
            return _0x5b2c4a + _0x53d877;
        }
    };
    if (!cookiesArr[0x0]) {
        if (_0x46874c['xEqlb'](_0x46874c['RwLCG'], _0x46874c['RwLCG'])) {
            return {
                'url': 'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body={"venderId":"' + functionId + '","shopId":"' + functionId + '","bindByVerifyCodeFlag":1,"registerExtend":{"v_sex":"未知","v_name":"名称","v_birthday":"2021-0' + _0x46874c['cnknp'](Math['round'](_0x46874c['xpBhV'](Math['random'](), 0x8)), 0x1) + '-0' + _0x46874c['IbwPk'](Math['round'](_0x46874c['xpBhV'](Math['random'](), 0x8)), 0x1) + '"},"writeChildFlag":0,"activityId":1454199,"channel":401}&client=H5&clientVersion=9.2.0&uuid=88888&jsonp=jsonp_1627049995456_46808',
                'headers': {
                    'Content-Type': _0x46874c['PQFVG'],
                    'Origin': _0x46874c['sNAkU'],
                    'Host': _0x46874c['CqsDy'],
                    'accept': _0x46874c['bxQGk'],
                    'User-Agent': _0x46874c['ktIqj'],
                    'content-type': _0x46874c['qGEBx'],
                    'Referer': 'https://shopmember.m.jd.com/shopcard/?venderId=' + functionId + '&shopId=' + functionId + '&venderType=1&channel=102&returnUrl=https%%3A%%2F%%2Flzdz1-isv.isvjcloud.com%%2Fdingzhi%%2Fdz%%2FopenCard%%2Factivity%%2F7376465%%3FactivityId%%3Dd91d932b9a3d42b9ab77dd1d5e783839%%26shareUuid%%3Ded1873cb52384a6ab42671eb6aac841d',
                    'Cookie': cookie
                }
            };
        } else {
            $['msg']($['name'], _0x46874c['EqJgw'], _0x46874c['dNQPR'], {
                'open-url': _0x46874c['dNQPR']
            });
            return;
        }
    }
    let _0x544b9a = process['env']['QQ_uid'];
    if (!_0x544b9a) {
        if (_0x46874c['xEqlb'](_0x46874c['urWlo'], _0x46874c['urWlo'])) {
            console['log']('' + JSON['stringify'](err));
            console['log']($['name'] + ' API请求失败，请检查网路重试');
        } else {
            //$['log']('你没有配置环境变量 QQ_uid 请先去配置再使用～\n');
            //return;
        }
    } else {
        //$['log']('你配置环境的变量 QQ_uid=' + _0x544b9a + '\x0a');
    }

    $['activeId'] = '';
    $['url'] = '';
    $['shareUuid'] = '';
    $['end'] = ![];
    let _0x45b3d0;
    try {
        if (_0x46874c['xEqlb'](_0x46874c['EIshg'], _0x46874c['EIshg'])) {
            _0x46874c['EiMsm'](resolve, data['data']);
        } else {
            _0x45b3d0 = await got['post']({
                'url': 'http://nas.tsukasa.pro:7410/openCardTeam/getConfigOfUid/' + _0x544b9a
            });
        }
    } catch (_0x270ac9) {
        if (_0x46874c['EZMUL'](_0x46874c['wrLiM'], _0x46874c['wrLiM'])) {
            $['log'](_0x46874c['lUBkp']);
        } else {
            console['log']($['name'] + ' API请求失败，请检查网路重试');
            $['activity'] = ![];
        }
    }
    try {
        if (_0x46874c['xEqlb'](_0x46874c['OqxZQ'], _0x46874c['OqxZQ'])) {
            console['log']('' + JSON['stringify'](err));
            console['log']($['name'] + ' API请求失败，请检查网路重试');
        } else {
            if (_0x45b3d0['body']['startsWith']('{')) {
                let _0x867a95 = JSON['parse'](_0x45b3d0['body']);
                if (_0x867a95['isSuccess']) {
                    if (_0x867a95['data']['activeId'] && _0x867a95['data']['url']) {
                        $['activeId'] = _0x867a95['data']['activeId'];
                        $['url'] = _0x867a95['data']['url'];
                        $['shareUuid'] = _0x867a95['data']['shareUuid'];
                        $['log']('你当前的配置为 ' + $['activeId'] + '\x20' + $['url']);
                        
                    } else {
                        if (_0x46874c['EZMUL'](_0x46874c['OgGQx'], _0x46874c['dzQcx'])) {
                            console['log']($['name'] + ' API请求失败，请检查网路重试');
                        } else {
                            $['log'](_0x46874c['ekLHF']);
                            return;
                        }
                    }
                } else {
                    $['log'](_0x867a95['msg']);
                    return;
                }
            } else {
                $['log'](_0x46874c['qezYP']);
                return;
            }
        }
    } catch (_0x363dd3) {
        $['log'](_0x46874c['qezYP']);
        return;
    }
    $['log']('\n=====将依次12345作为队长，ck排前优先\n');
    for (let _0x2ed48c = 0x0; _0x46874c['qoxNv'](_0x2ed48c, 0x5); _0x2ed48c++) {
        if (_0x46874c['xEqlb'](_0x46874c['nOcnC'], _0x46874c['oARkN'])) {
            if ($['end']) {
                break;
            }
            $['log']('\n\n\n\n\n\n\n\n\n======第' + _0x46874c['IbwPk'](_0x2ed48c, 0x1) + '次循环 全部入队 ' + _0x46874c['jWkBD'](decodeURIComponent, cookiesArr[0x0]['match'](/pt_pin=([^; ]+)(?=;?)/) && cookiesArr[0x0]['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]));
            await $['wait'](0xbb8);
            await _0x46874c['jWkBD'](startFor, cookiesArr);
            cookiesArr['unshift'](cookiesArr['splice'](_0x46874c['SQXEF'](_0x2ed48c, 0x1), 0x1)[0x0]);
        } else {
            _0x46874c['jeLFV'](resolve, data);
        }
    }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function startFor(_0x5de26a) {
    var _0x41c916 = {
        'YkiRb': '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取',
        'iHpXK': 'https://bean.m.jd.com/',
        'trkKi': function(_0x24cb59, _0x3745b9) {
            return _0x24cb59 < _0x3745b9;
        },
        'VEgKg': function(_0x49e385, _0x3de16a) {
            return _0x49e385 === _0x3de16a;
        },
        'msGlb': 'mXhmj',
        'shPbh': function(_0x513b4b, _0x181499) {
            return _0x513b4b(_0x181499);
        },
        'NhUgX': function(_0x52f667, _0xae34ab) {
            return _0x52f667 + _0xae34ab;
        },
        'oYbhn': 'https://bean.m.jd.com/bean/signIndex.action',
        'uIoVy': function(_0x33ee93, _0x27568e) {
            return _0x33ee93 !== _0x27568e;
        },
        'ElLLk': 'AhHvL',
        'fLcjh': 'iOcDF',
        'VKkBX': function(_0x2f55c7) {
            return _0x2f55c7();
        },
        'tvIQr': 'ubnUW',
        'ETozz': 'yfGvN',
        'EgvFb': function(_0x55a033, _0x22b918) {
            return _0x55a033 === _0x22b918;
        },
        'RDrol': 'ck1 开队失败，队伍满了！！！',
        'wJcal': 'ck1 开队失败，一般是黑了，尝试更换ck1或者对线客服或者联系作者！'
    };
    $['openTeam'] = ![];
    $['maxTeam'] = ![];
    for (let _0x2be2a3 = 0x0; _0x41c916['trkKi'](_0x2be2a3, _0x5de26a['length']); _0x2be2a3++) {
        if (_0x41c916['VEgKg'](_0x41c916['msGlb'], _0x41c916['msGlb'])) {
            await $['wait'](0xbb8);
            cookie = _0x5de26a[_0x2be2a3];
            if (cookie) {
                $['UserName'] = _0x41c916['shPbh'](decodeURIComponent, cookie['match'](/pt_pin=([^; ]+)(?=;?)/) && cookie['match'](/pt_pin=([^; ]+)(?=;?)/)[0x1]);
                $['index'] = _0x41c916['NhUgX'](_0x2be2a3, 0x1);
                $['isLogin'] = !! [];
                $['nickName'] = '';
                console['log']('\n\n******开始【京东账号' + $['index'] + '】' + ($['nickName'] || $['UserName']) + '*********\n');
                if (!$['isLogin']) {
                    $['msg']($['name'], '【提示】cookie已失效', '京东账号' + $['index'] + '\x20' + ($['nickName'] || $['UserName']) + '\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action', {
                        'open-url': _0x41c916['oYbhn']
                    });
                    if ($['isNode']()) {
                        if (_0x41c916['uIoVy'](_0x41c916['ElLLk'], _0x41c916['fLcjh'])) {
                            await notify['sendNotify']($['name'] + 'cookie已失效 - ' + $['UserName'], '京东账号' + $['index'] + '\x20' + $['UserName'] + '\n请重新登录获取cookie');
                        } else {
                            console['log']('' + JSON['stringify'](err));
                            console['log']($['name'] + ' API请求失败，请检查网路重试');
                        }
                    }
                    continue;
                }
                try {
                    await _0x41c916['VKkBX'](main);
                } catch (_0x10269d) {
                    if (_0x41c916['uIoVy'](_0x41c916['tvIQr'], _0x41c916['ETozz'])) {
                        $['logErr'](_0x10269d, '执行异常！跳过');
                        if (_0x41c916['EgvFb']($['index'], 0x1)) {
                            $['log']('亲先检查CK1，或者与作者取得联系！');
                            break;
                        }
                    } else {
                        //$['log']('你配置环境的变量 QQ_uid=' + uid + '\x0a');
                    }
                }
                if ($['maxTeam']) {
                    $['log'](_0x41c916['RDrol']);
                    break;
                }
                if (!$['openTeam']) {
                    $['log'](_0x41c916['wJcal']);
                }
                if ($['end']) {
                    return;
                }
            }
        } else {
            $['msg']($['name'], _0x41c916['YkiRb'], _0x41c916['iHpXK'], {
                'open-url': _0x41c916['iHpXK']
            });
            return;
        }
    }
}
async function main() {
    var _0x2282ba = {
        'xhcVE': '===== 入队成功！',
        'TflCi': 'application/json',
        'YvudH': 'XMLHttpRequest',
        'nDKVP': 'zh-cn',
        'hYZVE': 'gzip, deflate, br',
        'cRGZj': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'cOKeI': 'keep-alive',
        'AHrlW': 'set-cookie',
        'Xfzhp': function(_0x835d08, _0x5b46f9) {
            return _0x835d08 + _0x5b46f9;
        },
        'josur': function(_0x5a64fd, _0x7e3d4d) {
            return _0x5a64fd + _0x7e3d4d;
        },
        'LgIgx': function(_0x31b48f) {
            return _0x31b48f();
        },
        'NleLq': function(_0x44d7b2, _0x54fd9d) {
            return _0x44d7b2 === _0x54fd9d;
        },
        'bogKW': 'FcHZt',
        'VaPHG': 'mCvlF',
        'cugBf': function(_0x14db51) {
            return _0x14db51();
        },
        'NLlLM': function(_0x27c569, _0x2789ab) {
            return _0x27c569 + _0x2789ab;
        },
        'lQlvv': '400001',
        'VciQK': 'JbBjN',
        'nvdkz': '黑号!',
        'rVhJo': function(_0x2330c1) {
            return _0x2330c1();
        },
        'ElPFI': function(_0x428e44) {
            return _0x428e44();
        },
        'EgSxD': function(_0x380661, _0x1271bd) {
            return _0x380661 !== _0x1271bd;
        },
        'gZIpB': 'AUTH',
        'vqgKl': '加入队伍失败重试一次～',
        'pHmxm': function(_0x596e3d, _0x107b19) {
            return _0x596e3d(_0x107b19);
        },
        'oYlNc': '活动已结束',
        'WpjBn': function(_0x1aa8e4, _0x147b41) {
            return _0x1aa8e4 !== _0x147b41;
        },
        'jkFTU': '抱歉您还不是店铺会员',
        'AZgyN': function(_0x145831, _0x122680) {
            return _0x145831 !== _0x122680;
        },
        'bktnP': '活动仅限店铺会员参与',
        'LSZuV': function(_0x529587, _0x1da058) {
            return _0x529587 !== _0x1da058;
        },
        'TJUDw': 'VxhmY',
        'wkvwL': 'KrpeG',
        'elMQP': function(_0x4e3581, _0x470751) {
            return _0x4e3581 === _0x470751;
        },
        'DyFke': 'sLcJd',
        'YXCDp': 'zhVcE',
        'nfQru': function(_0x51bb1c, _0x2570ca) {
            return _0x51bb1c(_0x2570ca);
        },
        'KVZWm': function(_0x4cf920, _0x36f5f6) {
            return _0x4cf920(_0x36f5f6);
        },
        'ufqEu': function(_0x24f689) {
            return _0x24f689();
        },
        'UClWv': function(_0x2879a4, _0x625af1) {
            return _0x2879a4 !== _0x625af1;
        },
        'ijijz': function(_0x326125, _0x1b849f) {
            return _0x326125 === _0x1b849f;
        },
        'UkpTR': 'gtSWM',
        'fxLGq': 'pbYcp',
        'LcbnB': '队伍已经满员',
        'ZmIHR': function(_0x3ae6b3) {
            return _0x3ae6b3();
        },
        'gJwtA': function(_0x1d2987) {
            return _0x1d2987();
        },
        'tTDBK': function(_0x35113d, _0x4abb28) {
            return _0x35113d !== _0x4abb28;
        },
        'dDWqA': 'object',
        'ocEAA': function(_0x504c1f, _0x10ab99) {
            return _0x504c1f !== _0x10ab99;
        },
        'MMkiC': function(_0x11d10a, _0xf73668) {
            return _0x11d10a(_0xf73668);
        },
        'izYOL': function(_0x1efccf, _0x452408) {
            return _0x1efccf !== _0x452408;
        },
        'zEUJk': '您的组队数已达上限',
        'ByGGO': function(_0x507300, _0x4cece9) {
            return _0x507300 === _0x4cece9;
        },
        'ScJsi': 'FXSdN',
        'OnQJU': '你的队伍邀请码 ：'
    };
    await _0x2282ba['LgIgx'](activity);
    $['isvObfuscatorToken'] = await _0x2282ba['LgIgx'](getIsvObfuscatorToken);
    let _0xab615a = await _0x2282ba['LgIgx'](shopInfo);
    if (_0xab615a && _0xab615a['data'] && _0xab615a['data']['userId']) {
        if (_0x2282ba['NleLq'](_0x2282ba['bogKW'], _0x2282ba['VaPHG'])) {
            data = JSON['parse'](data);
            if (data['result']) {
                $['log'](_0x2282ba['xhcVE']);
            }
            $['log'](data['errorMessage']);
        } else {
            $['userId'] = _0xab615a['data']['userId'];
        }
    }
    let _0xb6dd84 = await _0x2282ba['cugBf'](getHtml);
    let _0x36fc21 = _0xb6dd84['headers'][_0x2282ba['AHrlW']]['filter'](_0x3fc1e7 => _0x3fc1e7['indexOf']('LZ_TOKEN_KEY') > -0x1)[0x0];
    let _0x3f26a9 = _0xb6dd84['headers'][_0x2282ba['AHrlW']]['filter'](_0x246d1f => _0x246d1f['indexOf']('LZ_TOKEN_VALUE') > -0x1)[0x0];
    _0x36fc21 = _0x36fc21['substr'](_0x2282ba['josur'](_0x36fc21['indexOf']('='), 0x1));
    _0x3f26a9 = _0x3f26a9['substr'](_0x2282ba['NLlLM'](_0x3f26a9['indexOf']('='), 0x1));
    $['LZ_TOKEN_KEY'] = _0x36fc21['substr'](0x0, _0x36fc21['indexOf'](';'));
    $['LZ_TOKEN_VALUE'] = _0x3f26a9['substr'](0x0, _0x3f26a9['indexOf'](';'));
    $['myPingData'] = await _0x2282ba['cugBf'](getMyPing);
    if (_0x2282ba['NleLq']($['myPingData'], '') || _0x2282ba['NleLq']($['myPingData'], _0x2282ba['lQlvv']) || !$['myPingData'] || !$['myPingData']['secretPin']) {
        if (_0x2282ba['NleLq'](_0x2282ba['VciQK'], _0x2282ba['VciQK'])) {
            $['log'](_0x2282ba['nvdkz']);
            return;
        } else {
            return;
        }
    }
    let _0x50ee3b = await _0x2282ba['rVhJo'](activityContent);
    if (_0x50ee3b['active'] && _0x50ee3b['active']['actUrl']) {
        $['log']('复制到手机浏览器打开活动页面 ' + _0x50ee3b['active']['actUrl']);
    }
    await _0x2282ba['rVhJo'](adLog);
    let _0x3d6ded = await _0x2282ba['ElPFI'](saveMember);
    if (_0x3d6ded['data'] && _0x2282ba['EgSxD'](_0x3d6ded['data']['indexOf'](_0x2282ba['gZIpB']), -0x1)) {
        $['log'](_0x2282ba['vqgKl']);
        $['myPingData']['secretPin'] = _0x2282ba['pHmxm'](encodeURIComponent, $['myPingData']['secretPin']);
        _0x3d6ded = await _0x2282ba['ElPFI'](saveMember);
    }
    if (_0x2282ba['EgSxD'](_0x3d6ded['errorMessage']['indexOf'](_0x2282ba['oYlNc']), -0x1)) {
        $['end'] = !! [];
        return;
    }
    let _0x22c411 = ![];
    if (_0x2282ba['WpjBn'](_0x3d6ded['errorMessage']['indexOf'](_0x2282ba['jkFTU']), -0x1) || _0x2282ba['AZgyN'](_0x3d6ded['errorMessage']['indexOf'](_0x2282ba['bktnP']), -0x1)) {
        if (_0x2282ba['LSZuV'](_0x2282ba['TJUDw'], _0x2282ba['wkvwL'])) {
            _0x22c411 = !! [];
        } else {
            $['log'](openCardTeamObj['msg']);
            return;
        }
    }
    if (_0x2282ba['NleLq'](_0x3d6ded['result'], !! [])) {
        if (_0x50ee3b['share'] && _0x50ee3b['share']['venderId']) {
            if (_0x2282ba['elMQP'](_0x2282ba['DyFke'], _0x2282ba['YXCDp'])) {
                //$['log']('你没有配置环境变量 QQ_uid 请先去配置再使用～\n');
                //return;
            } else {
                await _0x2282ba['pHmxm'](join, _0x50ee3b['share']['venderId']);
            }
        }
    } else if (_0x22c411) {
        if (_0x50ee3b['share']) {
            await _0x2282ba['nfQru'](join, _0x50ee3b['share']['venderId']);
        } else if (_0x50ee3b['active']) {
            await _0x2282ba['KVZWm'](join, _0x50ee3b['active']['venderId']);
        } else {
            $['log']('！！！！！！！未知错误！！！！！！！');
            $['end'] = !! [];
            return;
        }
        _0x3d6ded = await _0x2282ba['ufqEu'](saveMember);
        if (_0x3d6ded['data'] && _0x2282ba['UClWv'](_0x3d6ded['data']['indexOf'](_0x2282ba['gZIpB']), -0x1)) {
            if (_0x2282ba['ijijz'](_0x2282ba['UkpTR'], _0x2282ba['fxLGq'])) {
                return {
                    'url': 'https://' + $['url'] + url,
                    'body': body,
                    'headers': {
                        'Host': '' + $['url'],
                        'Accept': _0x2282ba['TflCi'],
                        'X-Requested-With': _0x2282ba['YvudH'],
                        'Accept-Language': _0x2282ba['nDKVP'],
                        'Accept-Encoding': _0x2282ba['hYZVE'],
                        'Content-Type': _0x2282ba['cRGZj'],
                        'Origin': 'https://' + $['url'],
                        'Connection': _0x2282ba['cOKeI'],
                        'Referer': referer ? referer : 'https://' + $['url'] + '/wxTeam/activity?activityId=' + $['activeId'] + '&signUuid=e39b935b34e64f5fbc4aefa6cb00d0d3&shareuserid4minipg=DQCK%2FksVMxxhAtP2wbQfI9A1Drq3za4lh6LFLfledF1cdSiqMbCx5edEEaL3RnCSkdK3rLBQpEQH9V4tdrrh0w%3D%3D&shopid=687475&lng=113.388014&lat=22.510994&sid=5503888e57b3e547528ca7d389a5a7aw&un_area=19_1657_52093_0',
                        'User-Agent': UA,
                        'Cookie': cookie + ' LZ_TOKEN_KEY=' + $['LZ_TOKEN_KEY'] + '; LZ_TOKEN_VALUE=' + $['LZ_TOKEN_VALUE'] + '; AUTH_C_USER=' + $['myPingData']['secretPin'] + ';\x20' + $['lz_jdpin_token']
                    }
                };
            } else {
                $['log'](_0x2282ba['vqgKl']);
                $['myPingData']['secretPin'] = _0x2282ba['KVZWm'](encodeURIComponent, $['myPingData']['secretPin']);
                _0x3d6ded = await _0x2282ba['ufqEu'](saveMember);
            }
        }
    }
    if (_0x2282ba['UClWv']($['index'], 0x1) && _0x2282ba['UClWv'](_0x3d6ded['errorMessage']['indexOf'](_0x2282ba['LcbnB']), -0x1)) {
        $['maxTeam'] = !! [];
        return;
    }
    await _0x2282ba['ZmIHR'](activityContent);
    if (_0x2282ba['ijijz']($['index'], 0x1)) {
        let _0x42b82e = await _0x2282ba['gJwtA'](saveCaptain);
        if (_0x2282ba['tTDBK'](typeof _0x42b82e['data'], _0x2282ba['dDWqA']) && _0x2282ba['ocEAA'](_0x42b82e['data']['indexOf'](_0x2282ba['gZIpB']), -0x1)) {
            $['myPingData']['secretPin'] = _0x2282ba['MMkiC'](encodeURIComponent, $['myPingData']['secretPin']);
            _0x42b82e = await _0x2282ba['gJwtA'](saveCaptain);
        }
        if (_0x2282ba['izYOL'](_0x42b82e['errorMessage']['indexOf'](_0x2282ba['oYlNc']), -0x1)) {
            $['end'] = !! [];
            return;
        }
        if (_0x2282ba['izYOL'](_0x42b82e['errorMessage']['indexOf'](_0x2282ba['zEUJk']), -0x1)) {
            if (_0x2282ba['ByGGO'](_0x2282ba['ScJsi'], _0x2282ba['ScJsi'])) {
                $['maxTeam'] = !! [];
                return;
            } else {
                if (err) {
                    console['log']($['name'] + ' API请求失败，请检查网路重试');
                    $['activity'] = ![];
                } else {
                    let _0xc0184a = resp['headers'][_0x2282ba['AHrlW']]['filter'](_0x39fc10 => _0x39fc10['indexOf']('LZ_TOKEN_KEY') > -0x1)[0x0];
                    let _0x51d5d0 = resp['headers'][_0x2282ba['AHrlW']]['filter'](_0x166976 => _0x166976['indexOf']('LZ_TOKEN_VALUE') > -0x1)[0x0];
                    _0xc0184a = _0xc0184a['substr'](_0x2282ba['Xfzhp'](_0xc0184a['indexOf']('='), 0x1));
                    _0x51d5d0 = _0x51d5d0['substr'](_0x2282ba['josur'](_0x51d5d0['indexOf']('='), 0x1));
                    $['LZ_TOKEN_KEY'] = _0xc0184a['substr'](0x0, _0xc0184a['indexOf'](';'));
                    $['LZ_TOKEN_VALUE'] = _0x51d5d0['substr'](0x0, _0x51d5d0['indexOf'](';'));
                }
            }
        }
        $['openTeam'] = !! [];
        _0x50ee3b = await _0x2282ba['gJwtA'](activityContent);
        $['shareUuid'] = _0x50ee3b['signUuid'];
        $['log'](_0x2282ba['NLlLM'](_0x2282ba['OnQJU'], $['shareUuid']));
    }
}
function activity() {
    var _0x2a2ddd = {
        'oetDG': function(_0x1ad56c, _0x3aae7a) {
            return _0x1ad56c === _0x3aae7a;
        },
        'ascwJ': 'YqbHm',
        'hZOXI': function(_0x34ddb2, _0x3628f6) {
            return _0x34ddb2 !== _0x3628f6;
        },
        'FFosx': 'BMxAr',
        'RmpUV': 'ywtas',
        'DbxGk': function(_0x177951, _0x1a2c97) {
            return _0x177951 === _0x1a2c97;
        },
        'Prexk': 'saAFr',
        'NsmhQ': 'lfLhp',
        'oHYCS': 'set-cookie',
        'sXLMP': function(_0x251533, _0x4b25ac) {
            return _0x251533 + _0x4b25ac;
        },
        'aSMBx': function(_0x3b2654, _0x599285) {
            return _0x3b2654(_0x599285);
        },
        'DTuPY': '配置读取失败，请与作者取得联系，或加入qq群',
        'lAAFL': 'jmoeM',
        'HFqsx': 'CGwFv'
    };
    return new Promise(_0x27ed48 => {
        var _0x801d18 = {
            'Wziiv': _0x2a2ddd['DTuPY']
        };
        if (_0x2a2ddd['DbxGk'](_0x2a2ddd['lAAFL'], _0x2a2ddd['HFqsx'])) {
            $['log']('！！！！！！！未知错误！！！！！！！');
            $['end'] = !! [];
            return;
        } else {
            $['get']({
                'url': 'https://' + $['url'] + '/wxTeam/activity?activityId=' + $['activeId'],
                'headers': {
                    'User-Agent': UA,
                    'Cookie': cookie
                }
            }, async(_0x480e4b, _0x21d1f7, _0x2259db) => {
                if (_0x2a2ddd['oetDG'](_0x2a2ddd['ascwJ'], _0x2a2ddd['ascwJ'])) {
                    try {
                        if (_0x480e4b) {
                            if (_0x2a2ddd['hZOXI'](_0x2a2ddd['FFosx'], _0x2a2ddd['RmpUV'])) {
                                console['log']($['name'] + ' API请求失败，请检查网路重试');
                                $['activity'] = ![];
                            } else {
                                joinFrist = !! [];
                            }
                        } else {
                            if (_0x2a2ddd['DbxGk'](_0x2a2ddd['Prexk'], _0x2a2ddd['NsmhQ'])) {
                                $['log'](_0x801d18['Wziiv']);
                                return;
                            } else {
                                let _0x225e5b = _0x21d1f7['headers'][_0x2a2ddd['oHYCS']]['filter'](_0x2e3fc2 => _0x2e3fc2['indexOf']('LZ_TOKEN_KEY') > -0x1)[0x0];
                                let _0x29ba6d = _0x21d1f7['headers'][_0x2a2ddd['oHYCS']]['filter'](_0x5cae57 => _0x5cae57['indexOf']('LZ_TOKEN_VALUE') > -0x1)[0x0];
                                _0x225e5b = _0x225e5b['substr'](_0x2a2ddd['sXLMP'](_0x225e5b['indexOf']('='), 0x1));
                                _0x29ba6d = _0x29ba6d['substr'](_0x2a2ddd['sXLMP'](_0x29ba6d['indexOf']('='), 0x1));
                                $['LZ_TOKEN_KEY'] = _0x225e5b['substr'](0x0, _0x225e5b['indexOf'](';'));
                                $['LZ_TOKEN_VALUE'] = _0x29ba6d['substr'](0x0, _0x29ba6d['indexOf'](';'));
                            }
                        }
                    } catch (_0x4eb090) {
                        $['activity'] = ![];
                        $['logErr'](_0x4eb090, _0x21d1f7);
                    } finally {
                        _0x2a2ddd['aSMBx'](_0x27ed48, _0x2259db);
                    }
                } else {
                    if (_0x480e4b) {
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    } else {
                        _0x2259db = JSON['parse'](_0x2259db);
                    }
                }
            });
        }
    });
}
function shopInfo() {
    var _0x2d5a85 = {
        'eVxkx': '===== 入队成功！',
        'GJtXc': function(_0x330663, _0x7efa18) {
            return _0x330663(_0x7efa18);
        },
        'LonFV': function(_0x5aaa3d, _0x2d4111) {
            return _0x5aaa3d !== _0x2d4111;
        },
        'BLmth': 'zEHNf',
        'RakhS': 'kErwo',
        'gNkHO': function(_0x20fb29, _0x3cbe60) {
            return _0x20fb29 === _0x3cbe60;
        },
        'nTEKP': 'QYOTA',
        'wKIBb': 'WhINr',
        'ICXYJ': function(_0x1c318d, _0x38b28c) {
            return _0x1c318d === _0x38b28c;
        },
        'XAqBn': 'MMPnL',
        'mfRjH': 'qUwtv',
        'ToqEB': function(_0x12bcf8, _0x654e85) {
            return _0x12bcf8 !== _0x654e85;
        },
        'aphmP': 'moccl',
        'fHUtz': 'mpxOI',
        'rckwO': 'application/json',
        'mKQqN': 'gzip, deflate, br',
        'Maxmf': 'zh-cn',
        'XJmKX': 'keep-alive',
        'QfIFZ': 'application/x-www-form-urlencoded'
    };
    return new Promise(_0x2c66b3 => {
        var _0x5a81a1 = {
            'rwFWa': _0x2d5a85['eVxkx'],
            'RuxnM': function(_0x16a11d, _0x9ebb8c) {
                return _0x2d5a85['GJtXc'](_0x16a11d, _0x9ebb8c);
            },
            'DZHLg': function(_0x2eb686, _0x379793) {
                return _0x2d5a85['LonFV'](_0x2eb686, _0x379793);
            },
            'JOsTP': _0x2d5a85['BLmth'],
            'DDDqz': _0x2d5a85['RakhS'],
            'XnbSk': function(_0x2e3166, _0x573799) {
                return _0x2d5a85['gNkHO'](_0x2e3166, _0x573799);
            },
            'wBgEd': _0x2d5a85['nTEKP'],
            'vGMtL': _0x2d5a85['wKIBb'],
            'BVtwK': function(_0x48f7ff, _0x210a6f) {
                return _0x2d5a85['ICXYJ'](_0x48f7ff, _0x210a6f);
            },
            'ScWna': _0x2d5a85['XAqBn'],
            'vakdg': _0x2d5a85['mfRjH']
        };
        if (_0x2d5a85['ToqEB'](_0x2d5a85['aphmP'], _0x2d5a85['fHUtz'])) {
            let _0x1bad5 = 'activityId=bef614c1c1474fbeb444080fc45ad13d';
            $['post']({
                'url': 'https://' + $['url'] + '/wxTeam/shopInfo',
                'body': 'activityId=' + $['activeId'],
                'headers': {
                    'Accept': _0x2d5a85['rckwO'],
                    'User-Agent': UA,
                    'Accept-Encoding': _0x2d5a85['mKQqN'],
                    'Accept-Language': _0x2d5a85['Maxmf'],
                    'Connection': _0x2d5a85['XJmKX'],
                    'Content-Type': _0x2d5a85['QfIFZ'],
                    'Host': '' + $['url'],
                    'Origin': 'https://' + $['url'],
                    'Referer': 'https://' + $['url'] + '/wxTeam/shopInfo?activityId=' + $['activeId'],
                    'Cookie': 'IsvToken=' + $['isvObfuscatorToken'] + '; APP_ABBR=CJHY; mba_muid=1628854890637370421985.74.1629765084246; mba_sid=74.4; __jda=60969652.1628854890637370421985.1628854890.1629739606.1629764696.61; __jdb=60969652.3.1628854890637370421985|61.1629764696; __jdc=60969652; __jdv=60969652|kong|t_2011637160_|jingfen|1d7f87ec6fa1438eab7f0652ea31e09f|1629764435496; pre_seq=2; pre_session=1595e0abf33098979c4c29722a536bf05c42f43d|777; LZ_TOKEN_KEY=' + $['LZ_TOKEN_KEY'] + '; LZ_TOKEN_VALUE=' + $['LZ_TOKEN_VALUE']
                }
            }, async(_0x37af32, _0x1f3aa6, _0x5a370e) => {
                var _0x329686 = {
                    'cEqzb': _0x5a81a1['rwFWa'],
                    'lujFd': function(_0x539dfc, _0xddd2d6) {
                        return _0x5a81a1['RuxnM'](_0x539dfc, _0xddd2d6);
                    }
                };
                if (_0x5a81a1['DZHLg'](_0x5a81a1['JOsTP'], _0x5a81a1['DDDqz'])) {
                    try {
                        if (_0x5a81a1['XnbSk'](_0x5a81a1['wBgEd'], _0x5a81a1['vGMtL'])) {
                            $['logErr'](e, _0x1f3aa6);
                        } else {
                            if (_0x37af32) {
                                console['log']($['name'] + ' API请求失败，请检查网路重试');
                            } else {
                                _0x5a370e = JSON['parse'](_0x5a370e);
                            }
                        }
                    } catch (_0x339a4a) {
                        if (_0x5a81a1['BVtwK'](_0x5a81a1['ScWna'], _0x5a81a1['vakdg'])) {
                            if (_0x37af32) {
                                console['log']('' + JSON['stringify'](_0x37af32));
                                console['log']($['name'] + ' API请求失败，请检查网路重试');
                            } else {
                                _0x5a370e = JSON['parse'](_0x5a370e);
                                if (_0x5a370e['result']) {
                                    $['log'](_0x329686['cEqzb']);
                                }
                                $['log'](_0x5a370e['errorMessage']);
                            }
                        } else {
                            $['logErr'](_0x339a4a, _0x1f3aa6);
                        }
                    } finally {
                        _0x5a81a1['RuxnM'](_0x2c66b3, _0x5a370e);
                    }
                } else {
                    _0x329686['lujFd'](_0x2c66b3, _0x5a370e);
                }
            });
        } else {
            data = JSON['parse'](data);
        }
    });
}
function saveMember() {
    var _0x3dcbeb = {
        'QoVFI': function(_0x474c5b, _0x1b4957) {
            return _0x474c5b(_0x1b4957);
        },
        'qrVrN': '===== 入队成功！',
        'ddMOC': function(_0x82c592, _0x1d3745) {
            return _0x82c592 !== _0x1d3745;
        },
        'wTXbQ': 'zQaHZ',
        'tIPRZ': function(_0x33f5ae, _0x5bcaf9) {
            return _0x33f5ae === _0x5bcaf9;
        },
        'JaEPJ': 'okEBr',
        'UubDD': 'hEAHv',
        'ITRZV': 'application/x-www-form-urlencoded'
    };
    return new Promise(_0x17af5f => {
        var _0x44b425 = {
            'pMPWY': function(_0x4de5c2, _0x10bec1) {
                return _0x3dcbeb['QoVFI'](_0x4de5c2, _0x10bec1);
            },
            'CnAot': _0x3dcbeb['qrVrN'],
            'AlWcC': function(_0x4664d3, _0x289f26) {
                return _0x3dcbeb['ddMOC'](_0x4664d3, _0x289f26);
            },
            'RbORJ': _0x3dcbeb['wTXbQ'],
            'ChcOD': function(_0x20ed19, _0x5ddd18) {
                return _0x3dcbeb['QoVFI'](_0x20ed19, _0x5ddd18);
            }
        };
        if (_0x3dcbeb['tIPRZ'](_0x3dcbeb['JaEPJ'], _0x3dcbeb['UubDD'])) {
            cookiesArr['push'](jdCookieNode[item]);
        } else {
            $['post']({
                'url': 'https://' + $['url'] + '/wxTeam/saveMember',
                'body': 'activityId=' + $['activeId'] + '&signUuid=' + $['shareUuid'] + '&pin=' + _0x3dcbeb['QoVFI'](encodeURIComponent, $['myPingData']['secretPin']) + '&pinImg=https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg&jdNick=' + $['nickName'],
                'headers': {
                    'User-Agent': 'UA',
                    'Content-Type': _0x3dcbeb['ITRZV'],
                    'Host': '' + $['url'],
                    'Origin': 'https://' + $['url'],
                    'Referer': 'https://' + $['url'] + '/wxTeam/captain/2293951?activityId=' + $['activeId'] + '&signUuid=' + $['shareUuid'] + '&shareuserid4minipg=DQCK/ksVMxxhAtP2wbQfI07oeVP9kq2pYSH90mYt4m3fwcJlClpxrfmVYaGKuquQkdK3rLBQpEQH9V4tdrrh0w==&shopid=1000014486',
                    'Cookie': 'LZ_TOKEN_KEY=' + $['LZ_TOKEN_KEY'] + '; LZ_TOKEN_VALUE=' + $['LZ_TOKEN_VALUE'] + '; AUTH_C_USER=' + $['myPingData']['secretPin'] + ';\x20' + $['lz_jdpin_token']
                }
            }, async(_0x17148c, _0x375488, _0x2cea5f) => {
                var _0x4300b9 = {
                    'Tosiy': function(_0x221e8f, _0x257129) {
                        return _0x44b425['pMPWY'](_0x221e8f, _0x257129);
                    }
                };
                try {
                    if (_0x17148c) {
                        console['log']('' + JSON['stringify'](_0x17148c));
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    } else {
                        _0x2cea5f = JSON['parse'](_0x2cea5f);
                        if (_0x2cea5f['result']) {
                            $['log'](_0x44b425['CnAot']);
                        }
                        $['log'](_0x2cea5f['errorMessage']);
                    }
                } catch (_0x375c2d) {
                    $['logErr'](_0x375c2d, _0x375488);
                } finally {
                    if (_0x44b425['AlWcC'](_0x44b425['RbORJ'], _0x44b425['RbORJ'])) {
                        _0x4300b9['Tosiy'](_0x17af5f, _0x2cea5f['data']);
                    } else {
                        _0x44b425['ChcOD'](_0x17af5f, _0x2cea5f);
                    }
                }
            });
        }
    });
}
function saveCaptain() {
    var _0xb41d66 = {
        'jkIOt': '开队成功！',
        'JELIb': function(_0x141ed7, _0x4ee585) {
            return _0x141ed7 === _0x4ee585;
        },
        'cdrjs': '开队失败！',
        'finGX': function(_0x413eb9, _0x388b66) {
            return _0x413eb9 === _0x388b66;
        },
        'YJgdh': 'HiytN',
        'MHZkc': 'Gwidg',
        'pXeLj': 'XNwXx',
        'wXnep': function(_0x5b46df, _0x1e0ca0) {
            return _0x5b46df !== _0x1e0ca0;
        },
        'YTKtp': 'object',
        'giGwn': 'AUTH',
        'FFcmM': function(_0x351408, _0x84fb32) {
            return _0x351408 === _0x84fb32;
        },
        'EiGNo': 'fIvxn',
        'oLLkw': 'PRPFv',
        'pTftZ': 'MtSqc',
        'nfdaM': 'RvQxQ',
        'BMteG': 'Nekzn',
        'sAbFO': 'UHrcd',
        'vpoyM': function(_0x1500dc, _0x2e1b75) {
            return _0x1500dc(_0x2e1b75);
        },
        'qPPOB': function(_0x5a79d4, _0x1e3e40, _0x2a6465, _0x14eb65) {
            return _0x5a79d4(_0x1e3e40, _0x2a6465, _0x14eb65);
        },
        'ZKvMq': '/wxTeam/saveCaptain',
        'AYBqK': function(_0x40a618, _0x19a948) {
            return _0x40a618(_0x19a948);
        }
    };
    return new Promise(_0x571d22 => {
        var _0x49dc15 = {
            'BqKjG': _0xb41d66['jkIOt'],
            'MsqSv': function(_0x1d24c6, _0x261774) {
                return _0xb41d66['JELIb'](_0x1d24c6, _0x261774);
            },
            'fFEqg': _0xb41d66['cdrjs'],
            'jjoiG': function(_0x583525, _0x2501b0) {
                return _0xb41d66['finGX'](_0x583525, _0x2501b0);
            },
            'waoIY': _0xb41d66['YJgdh'],
            'PloyI': _0xb41d66['MHZkc'],
            'seWsQ': _0xb41d66['pXeLj'],
            'GEkqJ': function(_0x13b8c6, _0x35b951) {
                return _0xb41d66['wXnep'](_0x13b8c6, _0x35b951);
            },
            'SjYdU': _0xb41d66['YTKtp'],
            'KbljM': _0xb41d66['giGwn'],
            'jzrpc': function(_0x9e5105, _0x5b8f87) {
                return _0xb41d66['FFcmM'](_0x9e5105, _0x5b8f87);
            },
            'DxbYf': _0xb41d66['EiGNo'],
            'rTfSa': _0xb41d66['oLLkw'],
            'BEpSi': _0xb41d66['pTftZ'],
            'UdQzm': _0xb41d66['nfdaM'],
            'Fwhbs': _0xb41d66['BMteG'],
            'ZidAG': _0xb41d66['sAbFO'],
            'AuRGj': function(_0x2b60e7, _0xce28b8) {
                return _0xb41d66['vpoyM'](_0x2b60e7, _0xce28b8);
            }
        };
        $['post'](_0xb41d66['qPPOB'](taskPostUrl, _0xb41d66['ZKvMq'], 'activityId=' + $['activeId'] + '&pin=' + _0xb41d66['AYBqK'](encodeURIComponent, $['myPingData']['secretPin']) + '&pinImg=https%3A%2F%2Fimg10.360buyimg.com%2Fimgzone%2Fjfs%2Ft1%2F7020%2F27%2F13511%2F6142%2F5c5138d8E4df2e764%2F5a1216a3a5043c5d.png&jdNick=' + $['nickName'], 'https://' + $['url'] + '/pool/saveCaptain'), async(_0x25efae, _0x199a98, _0x5871a9) => {
            var _0x5177f5 = {
                'rGwiY': _0x49dc15['BqKjG'],
                'mcipu': function(_0x19c3cf, _0x5621fb) {
                    return _0x49dc15['MsqSv'](_0x19c3cf, _0x5621fb);
                },
                'jGsQq': _0x49dc15['fFEqg']
            };
            if (_0x49dc15['jjoiG'](_0x49dc15['waoIY'], _0x49dc15['PloyI'])) {
                $['logErr'](e, _0x199a98);
            } else {
                try {
                    if (_0x25efae) {
                        if (_0x49dc15['jjoiG'](_0x49dc15['seWsQ'], _0x49dc15['seWsQ'])) {
                            console['log']('' + JSON['stringify'](_0x25efae));
                            console['log']($['name'] + ' API请求失败，请检查网路重试');
                        } else {
                            $['maxTeam'] = !! [];
                            return;
                        }
                    } else {
                        _0x5871a9 = JSON['parse'](_0x5871a9);
                        if (_0x5871a9['data'] && _0x49dc15['GEkqJ'](typeof _0x5871a9['data'], _0x49dc15['SjYdU']) && _0x49dc15['GEkqJ'](_0x5871a9['data']['indexOf'](_0x49dc15['KbljM']), -0x1)) {
                            if (_0x49dc15['jzrpc'](_0x49dc15['DxbYf'], _0x49dc15['DxbYf'])) {
                                if (_0x49dc15['jzrpc'](_0x5871a9['result'], !! [])) {
                                    $['log'](_0x49dc15['BqKjG']);
                                } else {
                                    if (_0x49dc15['GEkqJ'](_0x49dc15['rTfSa'], _0x49dc15['BEpSi'])) {
                                        $['log'](_0x49dc15['fFEqg']);
                                        $['log']('' + _0x5871a9['errorMessage']);
                                    } else {
                                        $['log'](_0x5177f5['rGwiY']);
                                    }
                                }
                            } else {
                                if (_0x5177f5['mcipu'](_0x5871a9['result'], !! [])) {
                                    $['log'](_0x5177f5['rGwiY']);
                                } else {
                                    $['log'](_0x5177f5['jGsQq']);
                                    $['log']('' + _0x5871a9['errorMessage']);
                                }
                            }
                        } else {
                            if (_0x49dc15['jzrpc'](_0x49dc15['UdQzm'], _0x49dc15['Fwhbs'])) {
                                $['activeId'] = openCardTeamObj['data']['activeId'];
                                $['url'] = openCardTeamObj['data']['url'];
                                $['shareUuid'] = openCardTeamObj['data']['shareUuid'];
                                $['log']('你当前的配置为 ' + $['activeId'] + '\x20' + $['url']);
                            } else {
                                $['log']('' + _0x5871a9['errorMessage']);
                            }
                        }
                    }
                } catch (_0x1f61cf) {
                    if (_0x49dc15['jzrpc'](_0x49dc15['ZidAG'], _0x49dc15['ZidAG'])) {
                        $['logErr'](_0x1f61cf, _0x199a98);
                    } else {
                        if (_0x25efae) {
                            console['log']('' + JSON['stringify'](_0x25efae));
                            console['log']($['name'] + ' API请求失败，请检查网路重试');
                        } else {
                            _0x5871a9 = JSON['parse'](_0x5871a9);
                        }
                    }
                } finally {
                    _0x49dc15['AuRGj'](_0x571d22, _0x5871a9);
                }
            }
        });
    });
}
function activityContent() {
    var _0x35c9b5 = {
        'dCdZx': function(_0x48ba13, _0x983f20) {
            return _0x48ba13(_0x983f20);
        },
        'nRlqN': function(_0x108002, _0x35fd2f) {
            return _0x108002(_0x35fd2f);
        },
        'xERws': '黑号!',
        'ALYwx': function(_0x2075bd, _0xeeebac) {
            return _0x2075bd(_0xeeebac);
        },
        'HWGpd': function(_0x227b56, _0x276caa) {
            return _0x227b56 === _0x276caa;
        },
        'aoGPj': 'QLTcx',
        'gidek': 'kTFda',
        'qDsGb': function(_0x370a1c, _0x19bdd3) {
            return _0x370a1c !== _0x19bdd3;
        },
        'vBMRX': 'LFVAO',
        'gaTti': 'vfxHs',
        'xTcfz': 'PpYpx',
        'oftrK': 'VAAEM',
        'IIcOx': function(_0x3c1050, _0x403981) {
            return _0x3c1050(_0x403981);
        },
        'cnkrA': 'BxJTk',
        'BFdyX': function(_0x416cba, _0x3563e8) {
            return _0x416cba(_0x3563e8);
        },
        'SZkTb': function(_0x2f2102, _0x7bba13, _0x720184, _0x107675) {
            return _0x2f2102(_0x7bba13, _0x720184, _0x107675);
        },
        'dnnIX': '/wxTeam/activityContent'
    };
    return new Promise(_0x41b3b7 => {
        var _0x4f5112 = {
            'uWbcv': function(_0x2bf9e5, _0x2ccae4) {
                return _0x35c9b5['dCdZx'](_0x2bf9e5, _0x2ccae4);
            },
            'ikuUB': function(_0x162434, _0x3437e9) {
                return _0x35c9b5['nRlqN'](_0x162434, _0x3437e9);
            },
            'OlUDP': _0x35c9b5['xERws'],
            'ASGeE': function(_0x328b6c, _0x38cc08) {
                return _0x35c9b5['ALYwx'](_0x328b6c, _0x38cc08);
            },
            'BcsbX': function(_0x3250ad, _0x1fffc4) {
                return _0x35c9b5['HWGpd'](_0x3250ad, _0x1fffc4);
            },
            'eCoJy': _0x35c9b5['aoGPj'],
            'rKMOE': _0x35c9b5['gidek'],
            'wxfRk': function(_0xdeb65a, _0x5e79c1) {
                return _0x35c9b5['qDsGb'](_0xdeb65a, _0x5e79c1);
            },
            'nGbpk': _0x35c9b5['vBMRX'],
            'TMvMj': _0x35c9b5['gaTti'],
            'HLnsL': _0x35c9b5['xTcfz'],
            'jedEt': _0x35c9b5['oftrK'],
            'txMen': function(_0x376728, _0x2198ef) {
                return _0x35c9b5['IIcOx'](_0x376728, _0x2198ef);
            },
            'iFlHt': _0x35c9b5['cnkrA']
        };
        let _0x543520 = 'activityId=' + $['activeId'] + '&pin=' + _0x35c9b5['BFdyX'](encodeURIComponent, $['myPingData']['secretPin']) + '&signUuid=' + $['shareUuid'];
        $['post'](_0x35c9b5['SZkTb'](taskPostUrl, _0x35c9b5['dnnIX'], _0x543520, 'https://' + $['url'] + '/wxTeam/activityContent'), async(_0x99e3e9, _0x407bb9, _0x3992f8) => {
            var _0x599573 = {
                'dIams': function(_0x113945, _0xbefb5f) {
                    return _0x4f5112['uWbcv'](_0x113945, _0xbefb5f);
                },
                'OPaNo': function(_0x39ffca, _0x3dde5f) {
                    return _0x4f5112['ikuUB'](_0x39ffca, _0x3dde5f);
                },
                'FuKiw': _0x4f5112['OlUDP'],
                'HPITo': function(_0x1caf56, _0x46f374) {
                    return _0x4f5112['ASGeE'](_0x1caf56, _0x46f374);
                }
            };
            try {
                if (_0x99e3e9) {
                    if (_0x4f5112['BcsbX'](_0x4f5112['eCoJy'], _0x4f5112['rKMOE'])) {
                        try {
                            _0x599573['dIams'](_0x41b3b7, _0x3992f8['data']);
                        } catch (_0xcc9dcb) {
                            $['log']('activityContent data.data错误！');
                            _0x599573['OPaNo'](_0x41b3b7, _0x3992f8);
                        }
                    } else {
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    }
                } else {
                    if (_0x4f5112['wxfRk'](_0x4f5112['nGbpk'], _0x4f5112['TMvMj'])) {
                        _0x3992f8 = JSON['parse'](_0x3992f8);
                    } else {
                        $['log'](_0x599573['FuKiw']);
                        return;
                    }
                }
            } catch (_0x212325) {
                if (_0x4f5112['wxfRk'](_0x4f5112['HLnsL'], _0x4f5112['jedEt'])) {
                    $['logErr'](_0x212325, _0x407bb9);
                } else {
                    $['logErr'](_0x212325, _0x407bb9);
                }
            } finally {
                try {
                    _0x4f5112['txMen'](_0x41b3b7, _0x3992f8['data']);
                } catch (_0x2b0309) {
                    if (_0x4f5112['BcsbX'](_0x4f5112['iFlHt'], _0x4f5112['iFlHt'])) {
                        $['log']('activityContent data.data错误！');
                        _0x4f5112['txMen'](_0x41b3b7, _0x3992f8);
                    } else {
                        _0x599573['HPITo'](_0x41b3b7, _0x3992f8);
                    }
                }
            }
        });
    });
}
function getIsvObfuscatorToken() {
    var _0x37e3de = {
        'EuLBu': function(_0x26c8b6, _0x2c94f8) {
            return _0x26c8b6(_0x2c94f8);
        },
        'azHnZ': function(_0x31247c, _0x14fcc0) {
            return _0x31247c !== _0x14fcc0;
        },
        'VlYPq': 'zVMsZ',
        'WVLvX': 'VHrsl',
        'FjlCw': 'Wfsit',
        'mgjRu': function(_0x4e71ee, _0x4ee4d1) {
            return _0x4e71ee === _0x4ee4d1;
        },
        'CkMPj': 'fmfzg',
        'oZfiG': 'UaLyI',
        'rkXuC': 'OvzMj',
        'VZpVO': '*/*',
        'wvLnG': 'gzip, deflate, br',
        'otoFg': 'zh-cn',
        'BRhWU': 'keep-alive',
        'OOuNy': 'application/x-www-form-urlencoded',
        'kfWKf': 'api.m.jd.com'
    };
    return new Promise(_0x4333e7 => {
        var _0x13a0a5 = {
            'XStFx': function(_0x2eb06c, _0x2eab6d) {
                return _0x37e3de['EuLBu'](_0x2eb06c, _0x2eab6d);
            },
            'pwIef': function(_0x3e7976, _0x5aff54) {
                return _0x37e3de['azHnZ'](_0x3e7976, _0x5aff54);
            },
            'UEggg': _0x37e3de['VlYPq'],
            'RbUxd': _0x37e3de['WVLvX'],
            'jqfpx': _0x37e3de['FjlCw'],
            'jMKAz': function(_0x44deb3, _0x1d5efb) {
                return _0x37e3de['mgjRu'](_0x44deb3, _0x1d5efb);
            },
            'gueEf': _0x37e3de['CkMPj'],
            'iloeA': _0x37e3de['oZfiG'],
            'CFqDu': function(_0x52c3af, _0x52c45d) {
                return _0x37e3de['azHnZ'](_0x52c3af, _0x52c45d);
            },
            'qzaQu': _0x37e3de['rkXuC']
        };
        $['post']({
            'url': 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
            'body': '"adid=7B411CD9-D62C-425B-B083-9AFC49B94228&area=16_1332_42932_43102&body=%7B%22url%22%3A%22https%3A%5C/%5C/cjhydz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167541&client=apple&clientVersion=9.4.0&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=48&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=11&screen=750%2A1334&sign=60bde51b4b7f7ff6e1bc1f473ecf3d41&st=1613720203903&sv=110&uts=0f31TVRjBStG9NoZJdXLGd939Wv4AlsWNAeL1nxafUsZqiV4NLsVElz6AjC4L7tsnZ1loeT2A8Z5/KfI/YoJAUfJzTd8kCedfnLG522ydI0p40oi8hT2p2sNZiIIRYCfjIr7IAL%2BFkLsrWdSiPZP5QLptc8Cy4Od6/cdYidClR0NwPMd58K5J9narz78y9ocGe8uTfyBIoA9aCd/X3Muxw%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=9cf90c586c4468e00678545b16176ed2"',
            'headers': {
                'Accept': _0x37e3de['VZpVO'],
                'Accept-Encoding': _0x37e3de['wvLnG'],
                'Accept-Language': _0x37e3de['otoFg'],
                'Connection': _0x37e3de['BRhWU'],
                'Content-Type': _0x37e3de['OOuNy'],
                'Host': _0x37e3de['kfWKf'],
                'Cookie': '' + cookie,
                'User-Agent': UA
            }
        }, async(_0x256b7c, _0x56ba44, _0x503135) => {
            var _0x59076d = {
                'kqvIH': function(_0xda27ce, _0x58f316) {
                    return _0x13a0a5['XStFx'](_0xda27ce, _0x58f316);
                }
            };
            if (_0x13a0a5['pwIef'](_0x13a0a5['UEggg'], _0x13a0a5['UEggg'])) {
                $['maxTeam'] = !! [];
                return;
            } else {
                try {
                    if (_0x13a0a5['pwIef'](_0x13a0a5['RbUxd'], _0x13a0a5['RbUxd'])) {
                        $['logErr'](e, _0x56ba44);
                    } else {
                        if (_0x256b7c) {
                            if (_0x13a0a5['pwIef'](_0x13a0a5['jqfpx'], _0x13a0a5['jqfpx'])) {
                                _0x13a0a5['XStFx'](_0x4333e7, _0x503135);
                            } else {
                                console['log']('' + JSON['stringify'](_0x256b7c));
                                console['log']($['name'] + ' API请求失败，请检查网路重试');
                            }
                        } else {
                            if (_0x13a0a5['jMKAz'](_0x13a0a5['gueEf'], _0x13a0a5['iloeA'])) {
                                _0x59076d['kqvIH'](_0x4333e7, _0x503135);
                            } else {
                                _0x503135 = JSON['parse'](_0x503135);
                            }
                        }
                    }
                } catch (_0x5e17b1) {
                    $['logErr'](_0x5e17b1, _0x56ba44);
                } finally {
                    if (_0x13a0a5['CFqDu'](_0x13a0a5['qzaQu'], _0x13a0a5['qzaQu'])) {
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    } else {
                        _0x13a0a5['XStFx'](_0x4333e7, _0x503135['token']);
                    }
                }
            }
        });
    });
}
function getMyPing() {
    var _0x22c0c0 = {
        'PhLFZ': function(_0x4e230f, _0x1f7048) {
            return _0x4e230f !== _0x1f7048;
        },
        'fIUFy': 'ksMDb',
        'rifOI': 'YkAvV',
        'pQPON': 'headers',
        'GHOxu': 'set-cookie',
        'qFGZK': function(_0x2ad78a, _0x595c0c) {
            return _0x2ad78a === _0x595c0c;
        },
        'WSpOg': 'RtCZX',
        'XvbbK': 'Xkpqq',
        'Qahxo': 'zXoQw',
        'KTyRb': function(_0x1d91cc, _0x574a9c) {
            return _0x1d91cc(_0x574a9c);
        },
        'dPWWh': function(_0x546de2, _0x484b4a) {
            return _0x546de2 + _0x484b4a;
        },
        'yuFUe': 'CookieJD',
        'JQOrr': 'CookieJD2',
        'xwXEr': function(_0x313b17, _0x5d9ba1) {
            return _0x313b17(_0x5d9ba1);
        },
        'RSTmN': 'CookiesJD',
        'dQTnG': 'application/x-www-form-urlencoded'
    };
    return new Promise(_0x1e3aec => {
        var _0x3f6da0 = {
            'IOLcO': _0x22c0c0['GHOxu'],
            'mciHA': function(_0x2e6466, _0x590c38) {
                return _0x22c0c0['dPWWh'](_0x2e6466, _0x590c38);
            },
            'WKdTn': _0x22c0c0['yuFUe'],
            'taVus': _0x22c0c0['JQOrr'],
            'psNig': function(_0x80b131, _0x4f41ca) {
                return _0x22c0c0['xwXEr'](_0x80b131, _0x4f41ca);
            },
            'QeqoA': _0x22c0c0['RSTmN']
        };
        $['post']({
            'url': 'https://' + $['url'] + '/customer/getMyPing',
            'body': 'userId=' + $['userId'] + '&token=' + $['isvObfuscatorToken'] + '&fromType=APP_pointRedeem',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                'Content-Type': _0x22c0c0['dQTnG'],
                'Host': '' + $['url'],
                'Referer': 'https://' + $['url'] + '/customer/getMyPing',
                'Cookie': 'LZ_TOKEN_KEY=' + $['LZ_TOKEN_KEY'] + '; LZ_TOKEN_VALUE=' + $['LZ_TOKEN_VALUE'] + ';'
            }
        }, async(_0x390beb, _0x3e4c7f, _0x51f403) => {
            try {
                if (_0x22c0c0['PhLFZ'](_0x22c0c0['fIUFy'], _0x22c0c0['rifOI'])) {
                    if (_0x390beb) {
                        console['log']('' + JSON['stringify'](_0x390beb));
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    } else {
                        _0x51f403 = JSON['parse'](_0x51f403);
                        $['lz_jdpin_token'] = _0x3e4c7f[_0x22c0c0['pQPON']][_0x22c0c0['GHOxu']]['filter'](_0x3fafcd => _0x3fafcd['indexOf']('lz_jdpin_token') !== -0x1)[0x0];
                    }
                } else {
                    $['end'] = !! [];
                    return;
                }
            } catch (_0xd4a828) {
                if (_0x22c0c0['qFGZK'](_0x22c0c0['WSpOg'], _0x22c0c0['WSpOg'])) {
                    $['logErr'](_0xd4a828, _0x3e4c7f);
                } else {
                    let _0x32de89 = _0x3e4c7f['headers'][_0x3f6da0['IOLcO']]['filter'](_0x5d46a4 => _0x5d46a4['indexOf']('LZ_TOKEN_KEY') > -0x1)[0x0];
                    let _0x2c9415 = _0x3e4c7f['headers'][_0x3f6da0['IOLcO']]['filter'](_0xa86d87 => _0xa86d87['indexOf']('LZ_TOKEN_VALUE') > -0x1)[0x0];
                    _0x32de89 = _0x32de89['substr'](_0x3f6da0['mciHA'](_0x32de89['indexOf']('='), 0x1));
                    _0x2c9415 = _0x2c9415['substr'](_0x3f6da0['mciHA'](_0x2c9415['indexOf']('='), 0x1));
                    $['LZ_TOKEN_KEY'] = _0x32de89['substr'](0x0, _0x32de89['indexOf'](';'));
                    $['LZ_TOKEN_VALUE'] = _0x2c9415['substr'](0x0, _0x2c9415['indexOf'](';'));
                }
            } finally {
                if (_0x22c0c0['qFGZK'](_0x22c0c0['XvbbK'], _0x22c0c0['Qahxo'])) {
                    cookiesArr = [$['getdata'](_0x3f6da0['WKdTn']), $['getdata'](_0x3f6da0['taVus']), ..._0x3f6da0['psNig'](jsonParse, $['getdata'](_0x3f6da0['QeqoA']) || '[]')['map'](_0xb37315 => _0xb37315['cookie'])]['filter'](_0xa5250c => !! _0xa5250c);
                } else {
                    _0x22c0c0['KTyRb'](_0x1e3aec, _0x51f403['data']);
                }
            }
        });
    });
}
function getHtml() {
    var _0x48c901 = {
        'jVUTY': '配置读取失败，请与作者取得联系，或加入qq群',
        'PtRgc': function(_0x91db32, _0x12a2bf) {
            return _0x91db32 === _0x12a2bf;
        },
        'TwIHt': 'DXyQN',
        'GOPbX': 'DLBSx',
        'RvxRA': function(_0x4535ba, _0x138557) {
            return _0x4535ba(_0x138557);
        },
        'LRvxV': function(_0x2e77d9, _0x1bd955) {
            return _0x2e77d9(_0x1bd955);
        }
    };
    return new Promise(_0x42d74a => {
        var _0x1305f6 = {
            'JAvvr': function(_0x25d2df, _0x164eb8) {
                return _0x48c901['LRvxV'](_0x25d2df, _0x164eb8);
            }
        };
        $['get']({
            'url': 'https://' + $['url'] + '/wxTeam/activity?activityId=' + $['activeId'] + '&signUuid=' + $['signUuid'] + '&shareuserid4minipg=P0CZ6sYjxiDL7YQZAjODCdA1Drq3za4lh6LFLfledF1cdSiqMbCx5edEEaL3RnCSkdK3rLBQpEQH9V4tdrrh0w%3D%3D&shopid=1000002505&lng=113.388012&lat=22.511089&sid=89638be87472b15e2772b966514b628w&un_area=19_1657_52093_0',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                'Host': '' + $['url'],
                'Referer': 'https://shopmember.m.jd.com/shopcard/?venderId=1000002505&shopId=1000002505&channel=8058&returnUrl=https://' + $['url'] + '/wxTeam/activity?activityId=' + $['activeId'] + '&signUuid=' + $['signUuid'] + '&shareuserid4minipg=P0CZ6sYjxiDL7YQZAjODCdA1Drq3za4lh6LFLfledF1cdSiqMbCx5edEEaL3RnCSkdK3rLBQpEQH9V4tdrrh0w%3D%3D&shopid=1000002505&lng=113.388012&lat=22.511089&sid=89638be87472b15e2772b966514b628w&un_area=19_1657_52093_0'
            }
        }, async(_0x33490e, _0x48f164, _0x4a75ea) => {
            var _0x1275ed = {
                'eFjDB': _0x48c901['jVUTY']
            };
            try {
                if (_0x33490e) {
                    if (_0x48c901['PtRgc'](_0x48c901['TwIHt'], _0x48c901['TwIHt'])) {
                        console['log']('' + JSON['stringify'](_0x33490e));
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    } else {
                        $['log'](_0x1275ed['eFjDB']);
                        return;
                    }
                } else {}
            } catch (_0x2037ff) {
                if (_0x48c901['PtRgc'](_0x48c901['GOPbX'], _0x48c901['GOPbX'])) {
                    $['logErr'](_0x2037ff, _0x48f164);
                } else {
                    _0x1305f6['JAvvr'](_0x42d74a, _0x4a75ea);
                }
            } finally {
                _0x48c901['RvxRA'](_0x42d74a, _0x48f164);
            }
        });
    });
}
function adLog() {
    var _0x1c85bf = {
        'OiLYw': function(_0x1999e0, _0x4dd8c5) {
            return _0x1999e0 !== _0x4dd8c5;
        },
        'rjxbV': 'vButy',
        'RsVwD': 'GSzdq',
        'OMrnD': function(_0x5b246f, _0x58a05f) {
            return _0x5b246f === _0x58a05f;
        },
        'PipcG': 'zLWee',
        'LFfDf': 'JHxwL',
        'phlXy': 'CGDXy',
        'cRuqR': function(_0x33fa71, _0x408eeb) {
            return _0x33fa71(_0x408eeb);
        },
        'xsstn': '请检查配置！',
        'AXeuV': 'application/x-www-form-urlencoded; Charset=UTF-8'
    };
    return new Promise(_0x2f3712 => {
        var _0x4a3629 = {
            'sFcxL': _0x1c85bf['xsstn']
        };
        $['post']({
            'url': 'https://' + $['url'] + '/common/accessLog',
            'body': 'venderId=0&code=99&pin=' + _0x1c85bf['cRuqR'](encodeURIComponent, $['myPingData']['secretPin']) + '&activityId=' + $['activeId'] + '&pageUrl=https%3A%2F%2F' + $['url'] + '%2FmicroDz%2Finvite%2Factivity%2Fwx%2Fview%2Findex%2F2613070%3FactivityId%3D' + $['activeId'] + '%26inviter%3Djzv2jbYRftpJUlB6E7%2Ff3%2FL7ldxmgdCpzmNX2HGi4eBuw30v%2FPoVBgxrRDHHbTlt%26inviterImg%3Dhttp%3A%2F%2Fstorage.360buyimg.com%2Fi.imageUpload%2F6a645f73495a76594b617266594d5731363237363637373836333031%5Fmid.jpg%26inviterNickName%3Dj%5FsIZvYKarfYMW%26shareuserid4minipg%3Djzv2jbYRftpJUlB6E7%252Ff3%252FL7ldxmgdCpzmNX2HGi4eBuw30v%252FPoVBgxrRDHHbTlt%26shopid%3D599119%26lng%3D0.000000%26lat%3D0.000000%26sid%3D5fa6c7778669e4865e2e7e7ba5ea098w%26un%5Farea%3D17%5F1458%5F1463%5F43894&subType=',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1',
                'Host': '' + $['url'],
                'Content-Type': _0x1c85bf['AXeuV'],
                'Referer': 'https://' + $['url'] + '/common/accessLog',
                'Cookie': 'LZ_TOKEN_KEY=' + $['LZ_TOKEN_KEY'] + '; LZ_TOKEN_VALUE=' + $['LZ_TOKEN_VALUE'] + '; AUTH_C_USER=' + $['myPingData']['secretPin'] + ';\x20' + $['lz_jdpin_token']
            }
        }, async(_0x47e5b5, _0x3044ee, _0x2e622f) => {
            try {
                if (_0x47e5b5) {
                    if (_0x1c85bf['OiLYw'](_0x1c85bf['rjxbV'], _0x1c85bf['RsVwD'])) {
                        console['log']('' + JSON['stringify'](_0x47e5b5));
                        console['log']($['name'] + ' API请求失败，请检查网路重试');
                    } else {
                        $['log'](_0x4a3629['sFcxL']);
                        return;
                    }
                } else {}
            } catch (_0x37fadb) {
                if (_0x1c85bf['OMrnD'](_0x1c85bf['PipcG'], _0x1c85bf['PipcG'])) {
                    $['logErr'](_0x37fadb, _0x3044ee);
                } else {
                    console['log']('' + JSON['stringify'](_0x47e5b5));
                    console['log']($['name'] + ' API请求失败，请检查网路重试');
                }
            } finally {
                if (_0x1c85bf['OiLYw'](_0x1c85bf['LFfDf'], _0x1c85bf['phlXy'])) {
                    _0x1c85bf['cRuqR'](_0x2f3712, _0x2e622f);
                } else {
                    $['logErr'](e, _0x3044ee);
                }
            }
        });
    });
}
function join(_0x5759ae) {
    var _0x73416 = {
        'nnKod': function(_0x54ae67, _0x375f64) {
            return _0x54ae67(_0x375f64);
        },
        'Gpmaq': function(_0x56a2ea, _0x4499a2) {
            return _0x56a2ea === _0x4499a2;
        },
        'PtEoW': 'JTYOO',
        'zCura': 'GTRTp',
        'NzEIl': function(_0x4b97d5, _0x3c20bb) {
            return _0x4b97d5 == _0x3c20bb;
        },
        'AhLRJ': 'FoGJK',
        'enPgD': function(_0x3d5038, _0x149a4e) {
            return _0x3d5038 !== _0x149a4e;
        },
        'KTXVx': 'vhiQW'
    };
    return new Promise(_0x2b6354 => {
        var _0x35dcc6 = {
            'QZEHy': function(_0x5677c3, _0x3e5e59) {
                return _0x73416['nnKod'](_0x5677c3, _0x3e5e59);
            }
        };
        $['get'](_0x73416['nnKod'](ruhui, '' + _0x5759ae), async(_0xe9aea6, _0x2a5d18, _0x2a337a) => {
            var _0x11c2e4 = {
                'FTTsD': function(_0x15bb38, _0x59813c) {
                    return _0x73416['nnKod'](_0x15bb38, _0x59813c);
                }
            };
            try {
                if (_0x73416['Gpmaq'](_0x73416['PtEoW'], _0x73416['zCura'])) {
                    _0x35dcc6['QZEHy'](_0x2b6354, _0x2a5d18);
                } else {
                    _0x2a337a = _0x2a337a['match'](/(\{().+\})/)[0x1];
                    _0x2a337a = JSON['parse'](_0x2a337a);
                    if (_0x73416['NzEIl'](_0x2a337a['success'], !! [])) {
                        if (_0x73416['Gpmaq'](_0x73416['AhLRJ'], _0x73416['AhLRJ'])) {
                            $['log'](_0x2a337a['message']);
                        } else {
                            $['log']('activityContent data.data错误！');
                            _0x11c2e4['FTTsD'](_0x2b6354, _0x2a337a);
                        }
                    } else if (_0x73416['NzEIl'](_0x2a337a['success'], ![])) {
                        $['log'](_0x2a337a['message']);
                    }
                }
            } catch (_0x4b43fc) {
                $['logErr'](_0x4b43fc, _0x2a5d18);
            } finally {
                if (_0x73416['enPgD'](_0x73416['KTXVx'], _0x73416['KTXVx'])) {
                    $['log']('复制到手机浏览器打开活动页面 ' + activityContentResp['active']['actUrl']);
                } else {
                    _0x73416['nnKod'](_0x2b6354, _0x2a337a);
                }
            }
        });
    });
}
function ruhui(_0x2c86ef) {
    var _0x5d7194 = {
        'aZMub': function(_0xd2c323, _0x25c63c) {
            return _0xd2c323 + _0x25c63c;
        },
        'lwVZf': function(_0x392922, _0x198227) {
            return _0x392922 * _0x198227;
        },
        'yxZQk': 'text/plain; Charset=UTF-8',
        'kLhdn': 'https://api.m.jd.com',
        'ydQIe': 'api.m.jd.com',
        'dmCLW': '*/*',
        'OHVWG': 'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1',
        'RVvIM': 'application/x-www-form-urlencoded'
    };
    return {
        'url': 'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body={"venderId":"' + _0x2c86ef + '","shopId":"' + _0x2c86ef + '","bindByVerifyCodeFlag":1,"registerExtend":{"v_sex":"未知","v_name":"名称","v_birthday":"2021-0' + _0x5d7194['aZMub'](Math['round'](_0x5d7194['lwVZf'](Math['random'](), 0x8)), 0x1) + '-0' + _0x5d7194['aZMub'](Math['round'](_0x5d7194['lwVZf'](Math['random'](), 0x8)), 0x1) + '"},"writeChildFlag":0,"activityId":1454199,"channel":401}&client=H5&clientVersion=9.2.0&uuid=88888&jsonp=jsonp_1627049995456_46808',
        'headers': {
            'Content-Type': _0x5d7194['yxZQk'],
            'Origin': _0x5d7194['kLhdn'],
            'Host': _0x5d7194['ydQIe'],
            'accept': _0x5d7194['dmCLW'],
            'User-Agent': _0x5d7194['OHVWG'],
            'content-type': _0x5d7194['RVvIM'],
            'Referer': 'https://shopmember.m.jd.com/shopcard/?venderId=' + _0x2c86ef + '&shopId=' + _0x2c86ef + '&venderType=1&channel=102&returnUrl=https%%3A%%2F%%2Flzdz1-isv.isvjcloud.com%%2Fdingzhi%%2Fdz%%2FopenCard%%2Factivity%%2F7376465%%3FactivityId%%3Dd91d932b9a3d42b9ab77dd1d5e783839%%26shareUuid%%3Ded1873cb52384a6ab42671eb6aac841d',
            'Cookie': cookie
        }
    };
}
function taskPostUrl(_0x13c3bb, _0x33335, _0x5f9973) {
    var _0x4ec11e = {
        'goizu': 'application/json',
        'VVFGo': 'XMLHttpRequest',
        'Xytlo': 'zh-cn',
        'vOsyj': 'gzip, deflate, br',
        'bbSZD': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'xHiwc': 'keep-alive'
    };
    return {
        'url': 'https://' + $['url'] + _0x13c3bb,
        'body': _0x33335,
        'headers': {
            'Host': '' + $['url'],
            'Accept': _0x4ec11e['goizu'],
            'X-Requested-With': _0x4ec11e['VVFGo'],
            'Accept-Language': _0x4ec11e['Xytlo'],
            'Accept-Encoding': _0x4ec11e['vOsyj'],
            'Content-Type': _0x4ec11e['bbSZD'],
            'Origin': 'https://' + $['url'],
            'Connection': _0x4ec11e['xHiwc'],
            'Referer': _0x5f9973 ? _0x5f9973 : 'https://' + $['url'] + '/wxTeam/activity?activityId=' + $['activeId'] + '&signUuid=e39b935b34e64f5fbc4aefa6cb00d0d3&shareuserid4minipg=DQCK%2FksVMxxhAtP2wbQfI9A1Drq3za4lh6LFLfledF1cdSiqMbCx5edEEaL3RnCSkdK3rLBQpEQH9V4tdrrh0w%3D%3D&shopid=687475&lng=113.388014&lat=22.510994&sid=5503888e57b3e547528ca7d389a5a7aw&un_area=19_1657_52093_0',
            'User-Agent': UA,
            'Cookie': cookie + ' LZ_TOKEN_KEY=' + $['LZ_TOKEN_KEY'] + '; LZ_TOKEN_VALUE=' + $['LZ_TOKEN_VALUE'] + '; AUTH_C_USER=' + $['myPingData']['secretPin'] + ';\x20' + $['lz_jdpin_token']
        }
    };
};
_0xodR = 'jsjiami.com.v6'


function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}
// prettier-ignore
function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
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
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log(`开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !! module.exports
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
            } catch {}
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
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const[o, h] = i.split("@"), n = {
                    url: `http: //${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============系统通知=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`${this.name}, 错误!`,t.stack):this.log("",`${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`${this.name}, 结束!  ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}