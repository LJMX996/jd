// [rule: 付费]
// [rule: 付费车]
// [rule: 上付费车]
// [rule: 付款码]
// [rule: 续费]
var qun = "https://s2.loli.net/2022/02/04/vsOiZeuW5mMqarK.jpg";
var money = "https://s2.loli.net/2022/02/04/pmHrMBW6AnPU4Q5.jpg";
//图文消息
var content = image(qun) + image(money) + "\n目前付费车助力直接跑满。\n相比之前的均等助力，\n 目前助力翻了3-5倍。\n 价格提高到10¥/月。\n 转账备注自己账号用户名(不是昵称，是京东设置里面的，长按可以复制的)。\n 用自助上车的号，上付费车可以直接私聊管理。\n http://47.100.44.200:9999进去登录以后，复制ck私聊发给管理，ck有效期一个月，那就每次转一个月的";
var imType = ImType();
if (imType == "fake") {
    var groups = [{
        imType: "wx",
        groupCode: 25331963676,
    },{
        imType: "wx",
        groupCode: 20481317764,
    },{
        imType: "wx",
        groupCode: 21784132403,
    },{
        imType: "wx",
        groupCode: 25454884764,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(qun)
    sendImage(money)
    sendText("\n目前付费车助力直接跑满。\n相比之前的均等助力，\n目前助力翻了3-5倍。\n价格提高到10¥/月。\n转账备注自己账号用户名\n(不是昵称，是京东设置里面的，长按可以复制的)。")
    sendText("\n用自助上车的号，无论上免费车还是普通车，都建议找管理手动上车，自助上车已经挂掉，对机器人发送上车取得详情")
}
