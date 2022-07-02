//[rule:[\s\S]*[(|)|#|@|$|%|¥|￥|!|！]([0-9a-zA-Z]{10,14})[(|)|#|@|$|%|¥|￥|!|！][\s\S]*]
//[rule:code ?]
//[rule:转口令 ?]

var code = "￥"+param(1)+"￥ /";
sendText(code)

sendText("正在解析口令，请稍等片刻......")
try {
    request({
        url: 'http://www.sixgod.work:9000/jd/jKeyCommand',
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "key=" + code
    }, function (err, resp, body) {
        result = JSON.parse(body)
        if (result.code == 200) {
            sendText("口令发起人：" + result.data.userName + "\n链接：" + result.data.jumpUrl)
        } else {
            sendText(result.msg)
        }
    });
} catch (e) {
    sendText(e)
}
